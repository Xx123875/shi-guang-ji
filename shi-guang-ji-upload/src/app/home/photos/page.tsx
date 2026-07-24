'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface Photo {
  id: string;
  user_id: string;
  album_name: string;
  url: string;
  caption: string | null;
  created_at: string;
}

export default function PhotosPage() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<string[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('全部');
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = async () => {
    if (!user || !supabase) return;
    const { data } = await supabase
      .from('photos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setPhotos(data);
      const albumSet = new Set(data.map(p => p.album_name));
      setAlbums(['全部', ...Array.from(albumSet)]);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user || !supabase || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      // 上传到 Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      // 获取公开 URL
      const { data: urlData } = supabase.storage.from('photos').getPublicUrl(filePath);

      // 保存到 photos 表
      await supabase.from('photos').insert({
        user_id: user.id,
        album_name: '默认相册',
        url: urlData.publicUrl,
        caption: null,
      });
    }

    setUploading(false);
    setShowUpload(false);
    fetchPhotos();
  };

  const handleDelete = async (id: string, url: string) => {
    if (!user || !supabase) return;

    // 从 URL 中提取文件路径
    const urlParts = url.split('/');
    const bucketIndex = urlParts.indexOf('photos');
    if (bucketIndex >= 0) {
      const filePath = urlParts.slice(bucketIndex + 1).join('/');
      await supabase.storage.from('photos').remove([filePath]);
    }

    await supabase.from('photos').delete().eq('id', id);
    fetchPhotos();
  };

  const filteredPhotos = selectedAlbum === '全部'
    ? photos
    : photos.filter(p => p.album_name === selectedAlbum);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">照片图库</h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          上传照片
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* 上传中提示 */}
      {uploading && (
        <div className="bg-primary-50 text-primary text-sm p-3 rounded-lg text-center">
          正在上传中...
        </div>
      )}

      {/* 分类标签 */}
      {albums.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setSelectedAlbum(album)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedAlbum === album
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {album}
            </button>
          ))}
        </div>
      )}

      {/* 照片网格 */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer bg-gray-100"
            >
              <img
                src={photo.url}
                alt={photo.caption || '照片'}
                className="w-full h-full object-cover"
              />
              {/* 悬浮操作 */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                {photo.caption && (
                  <p className="text-white text-xs truncate flex-1">{photo.caption}</p>
                )}
                <button
                  onClick={() => handleDelete(photo.id, photo.url)}
                  className="text-white text-xs bg-red-500/80 px-2 py-1 rounded hover:bg-red-600/80 shrink-0 ml-2"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📷</div>
          <p className="text-gray-400">还没有照片</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 text-primary text-sm hover:underline"
          >
            上传第一张照片
          </button>
        </div>
      )}
    </div>
  );
}
