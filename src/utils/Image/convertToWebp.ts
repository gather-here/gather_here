export const convertToWebp = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
  
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
  
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas context 가져오기 실패"));
  
          ctx.drawImage(img, 0, 0);
  
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("WebP 변환 실패"));
              const webpFile = new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
                type: "image/webp",
                lastModified: Date.now(),
              });
              resolve(webpFile);
            },
            "image/webp",
            0.9
          );
        };
  
        img.onerror = () => reject(new Error("이미지 로딩 실패"));
      };
  
      reader.onerror = () => reject(new Error("파일 읽기 실패"));
  
      reader.readAsDataURL(file);
    });
  };