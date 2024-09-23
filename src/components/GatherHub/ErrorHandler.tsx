import React from 'react';
import axios from 'axios';

const ERROR_STATUS = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
};

interface ErrorHandlerProps {
  error: unknown;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error }) => {
  let errorMessage = '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === ERROR_STATUS.SERVER_ERROR) {
      errorMessage = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    } else if (status === ERROR_STATUS.NOT_FOUND) {
      errorMessage = '요청하신 데이터를 찾을 수 없습니다.';
    } else if (status === ERROR_STATUS.UNAUTHORIZED || status === ERROR_STATUS.FORBIDDEN) {
      errorMessage = '접근 권한이 없습니다. 로그인 후 다시 시도해 주세요.';
    } else if (!error.response && error.request) {
      errorMessage = '네트워크 문제가 발생했습니다. 연결을 확인해 주세요.';
    }
  }

  return (
    <div>
      <p>{errorMessage}</p>
      <button onClick={() => window.location.reload()}>다시 시도</button>
    </div>
  );
};

export default ErrorHandler;