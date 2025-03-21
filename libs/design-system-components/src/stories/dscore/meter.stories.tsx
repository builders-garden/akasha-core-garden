import type { Meta, StoryObj } from '@storybook/react';
import Meter, { MeterProps } from '@akashaorg/design-system-core/lib/components/Meter';

const meta: Meta<MeterProps> = {
  title: 'DSCore/Meters/Meter',
  component: Meter,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'number' },
    thickness: { control: 'number' },
    value: { control: 'number' },
    max: { control: 'number' },
    progressBg: { control: 'text' },
    background: { control: 'text' },
    type: { control: 'select', options: ['circle', 'bar'] },
    direction: { control: 'select', options: ['horiontal', 'vertical'] },
    customStyle: { control: 'text' },
    children: { control: 'text' },
  },
};

type Story = StoryObj<MeterProps>;

export const Default: Story = { args: { size: 100, value: 60, thickness: 2, type: 'circle' } };

export const BarMeter: Story = {
  args: { size: 100, value: 60, thickness: 2, type: 'bar' },
};

export const BarMeterWithDirection: Story = {
  args: {
    size: 100,
    value: 60,
    thickness: 2,
    type: 'bar',
    direction: 'horizontal',
  },
};

export default meta;
