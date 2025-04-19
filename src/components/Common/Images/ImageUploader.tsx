"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { convertToWebp } from "@/utils/Image/convertToWebp";

interface ImageUploaderProps {
  imageUrl: string; // 현재 이미지 URL
  onUpload: (file: File) => Promise<void>; // 업로드 후 처리 함수
  onError?: (message: string) => void; // 에러 발생 시 처리 함수
}

const MAX_FILE_SIZE_MB = 3; // 최대 허용 이미지 크기 (3MB)

// 확장자 + MIME 타입 둘 다 검사해서 안전하게 막기
const isValidImage = (file: File) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const allowedExts = ["jpg", "jpeg", "png", "webp"];
  const ext = file.name.split(".").pop()?.toLowerCase();
  const mime = file.type;

  return !!ext && !!mime && allowedExts.includes(ext) && allowedTypes.includes(mime);
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ imageUrl, onUpload, onError }) => {
  const [uploading, setUploading] = useState(false); // 업로드 중인지 상태
  const [isDragging, setIsDragging] = useState(false); // 드래그로 이미지 업로드할때 테두리
  const inputRef = useRef<HTMLInputElement | null>(null); // 숨겨진 input 클릭용

  // 버튼 누르면 input 작동시키기
  const handleClick = useCallback(() => {
    if (!uploading) inputRef.current?.click();
  }, [uploading]);

  // 파일 선택되면 호출됨
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await validateAndUpload(file);
  };

  // 파일 형식 검사
  const validateAndUpload = async (file: File) => {
    if (!isValidImage(file)) {
      onError?.("이미지 업로드는 jpg, jpeg, png 형식만 가능합니다.");
      return;
    }
    // 파일 용량 검사
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      onError?.(`이미지는 ${MAX_FILE_SIZE_MB}MB 이하만 업로드 가능합니다.`);
      return;
    }
    setUploading(true);
    try {
      const webpFile = await convertToWebp(file); // WebP 변환
      await onUpload(webpFile);                   // 변환된 파일 업로드
    } catch {
      onError?.("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // 드래그가 시작되었을 때
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };


  // 드래그 앤 드롭으로 파일이 들어왔을 때
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false); // 드래그 종료 처리
    const file = e.dataTransfer.files?.[0];
    if (file) await validateAndUpload(file);
  };

  return (
    <div
      className={`w-48 h-48 s:w-30 s:h-30 rounded-[20px] bg-black/70 overflow-hidden relative group cursor-pointer transition-all duration-300 ${
        isDragging
          ? "border-2 border-dashed border-primary bg-black/70"
          : "bg-black/80"
      }`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => void handleDrop(e)}
    >
      {/* 업로드 중 */}
      {uploading ? (
        <div className="w-full h-full flex items-center justify-center bg-black/60 text-white z-10">
          업로드 중...
        </div>
      ) : (
        <Image
          src={imageUrl}
          alt="프로필 이미지"
          fill
          className="object-cover transition-all duration-300 group-hover:scale-105 brightness-75"
        />
      )}

      <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none transition-all duration-300 group-hover:bg-black/80" />


      {/* 기본 아이콘 + 텍스트 (항상 표시) */}
      {!uploading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-300">
          <Image
            src="/assets/mypage/image_upload.svg"
            alt="이미지 업로드 아이콘"
            width={48}
            height={48}
            className="group-hover:hidden opacity-80 mb-1"
          />
          <span className="text-white text-[11px] group-hover:hidden">이미지 업로드</span>
        </div>
      )}

      {/* 호버 or 드래그 중 인터랙션 메시지 */}
      <div
        className={`absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-[35%] z-30 w-max 
        ${isDragging ? "flex" : "hidden"} group-hover:flex flex-col items-center animate-fade-in`}
      >
        <p className="text-white text-[12px] font-medium whitespace-nowrap text-center">
          이미지를 선택하거나 드래그해보세요
        </p>
        <p className="text-gray-300 text-[8px] font-normal whitespace-nowrap text-center">
          (최대 3MB / jpg, jpeg, png, webp 첨부가능)
        </p>
      </div>

      {/* 파일 선택 input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => void handleChange(e)}
        className="hidden"
        disabled={uploading} // 업로드 중이면 비활성화
      />
    </div>
  );
};

export default ImageUploader;