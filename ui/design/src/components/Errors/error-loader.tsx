import * as React from 'react';
import type { ErrorLoaderProps } from './interfaces';
import ErrorCard from './error-card';

const ErrorLoader: React.FC<ErrorLoaderProps> = props => {
  const { type, publicImgPath = '/images' } = props;

  let imagesrc;
  switch (type) {
    case 'missing-saved-items':
      imagesrc = `${publicImgPath}/no-saved-posts-error.png`;
      break;
    case 'missing-feed-customization':
      imagesrc = `${publicImgPath}/no-feed-customization-error.png`;
      break;
    case 'no-connection':
      imagesrc = `${publicImgPath}/no-internet-connection-error.png`;
      break;
    case 'no-login':
    default:
      imagesrc = `${publicImgPath}/general-error.png`;
      break;
  }

  return <ErrorCard imageSrc={imagesrc} {...props} />;
};

export default ErrorLoader;
