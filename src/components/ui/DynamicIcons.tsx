import { Icon, IconProps } from '@iconify/react';

type Props = {
  iconName: string;
  width?: number;
  height?: number;
  color?: string;
} & Omit<IconProps, 'icon' | 'width' | 'height' | 'color'>;


export const DynamicIcons = ({
  iconName,
  width = 24,
  height = 24,
  color,
  ...rest
}: Props) => {
  return <Icon icon={iconName} width={width} height={height} color={color} {...rest} />;
};

