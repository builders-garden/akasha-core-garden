import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

type CardSize = { width?: string | number; height?: string | number };

export type DefaultEmptyCardProps = {
  infoText: string;
  buttonLabel?: string;
  image?: string;
  noBorder?: boolean;
  customCardSize?: CardSize;
  buttonClickHandler?: () => void;
};

const DefaultEmptyCard: React.FC<DefaultEmptyCardProps> = ({
  infoText,
  buttonLabel,
  image,
  noBorder = false,
  customCardSize,
  buttonClickHandler,
}) => {
  const cardSize = ` w-[${customCardSize?.width ? customCardSize.width : '180px'}] h-[${
    customCardSize?.height ? customCardSize.height : '180px'
  }]`;

  return (
    <Card
      elevation={noBorder ? 'none' : '1'}
      radius={20}
      padding={'p-4'}
      customStyle="dark:bg-transparent"
    >
      {image ? (
        <Image src={image} customStyle="w-[180px] h-[180px] m-auto my-4" />
      ) : (
        <Card
          elevation={'none'}
          customStyle={`bg(grey8 dark:grey5) shrink-0 m-auto my-4 ${cardSize}`}
          radius="rounded-xl"
        />
      )}
      <Text variant="h6" align="center">
        {infoText}
      </Text>
      <Stack justify="end" fullWidth spacing="gap-y-4" customStyle="pt-2">
        {buttonLabel && (
          <Button variant="primary" label={buttonLabel} onClick={buttonClickHandler} />
        )}
      </Stack>
    </Card>
  );
};

export default DefaultEmptyCard;
