import React from 'react';

interface Props {
  info: string;
  value: string;
}

export function GameInfo(props: Props) {
  return (
    <p className="text-white">
      {props.info}: <span className="text-primary">{props.value}</span>
    </p>
  );
}
