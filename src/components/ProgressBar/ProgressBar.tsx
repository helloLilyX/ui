import React, { forwardRef, useEffect, useState } from 'react';
import { useProgressBar } from 'react-aria';
import { Box } from '../Box';
import { Group } from '../Group';
import { Stack } from '../Stack';

export type ProgressBarProps = {
  label: string;
  value?: number;
  minValue?: number;
  maxValue?: number;
};

/**
 *
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ label, value, minValue, maxValue }, ref) => {
    const [percentComplete, setPercentComplete] = useState<number>(0);

    if (!value && label === 'Loading continuously...') {
      useEffect(() => {
        if (percentComplete < 100) {
          setTimeout(() => setPercentComplete(percentComplete + 5), 500);
        }
      }, [percentComplete]);
    } else if (!value) {
      setPercentComplete(-1);
    }

    const props = {
      label,
      showValueLabel: !!label,
      value: value ?? percentComplete,
      minValue: minValue ?? 0,
      maxValue: maxValue ?? 100
    };

    const { progressBarProps, labelProps } = useProgressBar(props);

    console.log(progressBarProps, labelProps);

    let barWidth;
    if (props.value > -1) {
      // Calculate the width of the progress bar as a percentage
      const percentage = (props.value - props.minValue) / (props.maxValue - props.minValue);
      barWidth = `${Math.round(percentage * 100)}%`;
    }

    return (
      <Box {...progressBarProps} w="full">
        <Group justify="apart" fs="sm">
          {label && <span {...labelProps}>{label}</span>}
          {label && <span>{progressBarProps['aria-valuetext']}</span>}
        </Group>

        <Box bgc="light-shade">
          <Box w={barWidth} bgc="info" h={4} />
        </Box>
      </Box>
    );
  }
);
