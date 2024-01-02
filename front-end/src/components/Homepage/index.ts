import React, { FC } from 'react';

interface TitleProps {
  title: string;
}

const Title: FC<TitleProps> = ({ title }) => {
  return (
    <div>
    <h1>{ title } < div div / h1 >
      // <h2>{subtitle}</h2>
      </>
  );
};

export default Title;