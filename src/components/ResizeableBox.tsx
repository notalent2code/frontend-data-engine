import React from 'react';
import { ResizableBox as ReactResizableBox } from 'react-resizable';

import 'react-resizable/css/styles.css';

const ResizableBox = ({
  children,
  width = 800,
  height = 300,
  resizable = false,
  style = {},
  className = '',
}: {
  children: React.ReactNode;
  width?: number;
  height?: number;
  resizable?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) => {
  return (
    <div className='w-full'>
      <div
        style={{
          display: 'inline-block',
          width: 'auto',
          background: 'white',
          ...style,
        }}
      >
        {resizable ? (
          <ReactResizableBox width={width} height={height}>
            <div
              style={{
                width: '100%',
                height: '100%',
              }}
              className={className}
            >
              {children}
            </div>
          </ReactResizableBox>
        ) : (
          <div
            className={className}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResizableBox;
