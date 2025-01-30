import WellnessRatingScoring from './WellnessRatingScoring';
import styles from './WellnessRating.module.css';
import { useWellnessRating } from '@/components/wellness-rating/useWellnessRating.tsx';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { Button, Textarea, Group, Flex, Accordion, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { type WellnessRatingScore } from '@/components/wellness-rating/types';
import { type TypologyID } from '@/components/typology/types';

interface WellnessRatingProps {
  wellnessType: string;
  typologyID: TypologyID;
  showAdditionalSettings?: boolean;
  overrideDate?: Date | null;
}

export type WellnessRatingHandle = {
  onSubmitWellnessRating: () => void;
}

const defaultScore = 0;

const WellnessRating = forwardRef<WellnessRatingHandle, WellnessRatingProps>(({ wellnessType, typologyID, showAdditionalSettings = false, overrideDate = null }, ref) => {
  const { submitWellnessRating } = useWellnessRating();
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [wellnessRatingScore, setWellnessRatingScore] = useState<WellnessRatingScore>(defaultScore);
  const [date, setDate] = useState<Date | null>(overrideDate);

  if (date !== overrideDate) {
    setDate(overrideDate);
  }

  const onSubmitWellnessRating = () => {
    if (!descriptionRef.current) {
      console.error('Cannot access wellness description');
    }
    submitWellnessRating({
      typologyID: typologyID,
      wellnessScore: wellnessRatingScore,
      wellnessDescription: descriptionRef?.current?.value ?? '',
    }, wellnessType, date);

    // Reset score back to default
    setWellnessRatingScore(defaultScore);
    if (!descriptionRef || !descriptionRef.current) return;
    descriptionRef.current.value = '';
  }

  useImperativeHandle(ref, () => ({
    onSubmitWellnessRating
  }));

  return (
    <Flex
      direction='column'
      gap='sm'
    >
      <p 
        className={styles['wellness-scoring-title']}
      >Rate your <strong>{ wellnessType }</strong> on a scale from 0 to 10.
      </p>
      <WellnessRatingScoring
        value={wellnessRatingScore}
        setValue={setWellnessRatingScore}
      />
      <Textarea
        label="Description"
        placeholder="Add an optional description"
        autosize
        minRows={3}
        ref={descriptionRef}
      />
      {
        showAdditionalSettings ?
        <Accordion>
          <Accordion.Item className={'flat-accordion'} value={'Additional Settings'}>
          <Accordion.Control>{'Additional Settings'}</Accordion.Control>
          <Accordion.Panel>
            <Flex justify="center" direction="column">
              <Text fw={600} size='md' ta='center' mb="sm" c="wellnessRed">Override Date</Text>
              <Flex justify="center" direction="row">
                <DatePicker
                  value={date}
                  onChange={setDate}
                  maxDate={new Date()}
                />
              </Flex>
            </Flex>
          </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        :
        null
      }
      <Group justify="flex-end">
        <Button
          onClick={() => onSubmitWellnessRating()}
        >Submit</Button>
      </Group>
    </Flex>
  );
});

export default WellnessRating;
