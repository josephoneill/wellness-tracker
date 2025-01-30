import { useTypologies } from "@/components/typology/useTypologies";
import WellnessRatingChart from "@/components/wellness-rating/WellnessRatingChart";
import WellnessRatingList from "@/components/wellness-rating/WellnessRatingList/WellnessRatingList";
import { useWellnessRating } from '@/components/wellness-rating/useWellnessRating.tsx';

import { Accordion, Button, Card, Divider, Flex, Loader, Stack, Switch, Text } from "@mantine/core";
import AddTypologyCard from "@/components/typology/AddTypology/AddTypologyCard";

import { useMemo, useState, useRef } from "react";
import WellnessRating, { WellnessRatingHandle } from "@/components/wellness-rating/WellnessRating";
import { DateInput } from "@mantine/dates";

const RatingsPage = () => {
  const [useOverrideDate, setUseOverrideDate] = useState<boolean>(false);
  const [overrideDate, setOverrideDate] = useState<Date | null>(new Date());
  const wellnesRatingRefs = useRef<(WellnessRatingHandle | null)[]>([]);
  const { wellnessRatings } = useWellnessRating();
  const { typologies, getTypologyById } = useTypologies();

  const wellnessRatingCards = useMemo(() => {
    if (!typologies) {
      return <Loader />
    }

    return typologies.map((typology, index) => {
      // If we have the "Override Date" switch on, use custom override date.
      // Otherwise, use today's date
      const wellnessOverrideDate = useOverrideDate ? overrideDate : new Date();
      return (
        <Accordion.Item value={typology.typologyType}>
          <Accordion.Control>{typology.typologyType}</Accordion.Control>
          <Accordion.Panel className={'scrollable-accordion-panel'}>
            <Card padding='sm' radius='md' withBorder>
              <WellnessRating
                ref={el => (wellnesRatingRefs.current[index] = el)}
                wellnessType={typology.typologyType}
                typologyID={typology.sk}
                overrideDate={wellnessOverrideDate}
                showAdditionalSettings={true}
              />
            </Card>
          </Accordion.Panel>
        </Accordion.Item>
      )
    });
  }, [typologies, overrideDate, useOverrideDate]);
  
  const wellnessRatingLogsList = useMemo(() => {
    if (!wellnessRatings) {
      return <Loader />
    }

    return Array.from(wellnessRatings.entries()).map(([key, value]) => {
      const typology = getTypologyById(key);

      if (!typology) {
        return <Loader />
      }

      return (
        <Accordion.Item value={typology.typologyType}>
          <Accordion.Control>{typology.typologyType}</Accordion.Control>
          <Accordion.Panel className={'scrollable-accordion-panel'}>
            <WellnessRatingList
              key={`wellness-list-${key}`}
              items={value}
            />
          </Accordion.Panel>
        </Accordion.Item>
      )
    });
  }, [wellnessRatings, typologies]);

  const onSubmitAllClick = () => {
    console.log('click');
    wellnesRatingRefs.current.forEach(ref => {
      console.log(ref);
      if (ref) {
        ref.onSubmitWellnessRating();
      }
    });
  };
  
  return (
    <main className='page'>
      <WellnessRatingChart />
      <Divider />
      <div>
        <Text size="xl" fw={500} mb="sm" color="">Track</Text>
        <Stack>
          <Switch
            label="Override Date"
            checked={useOverrideDate}
            onChange={(event) => setUseOverrideDate(event.currentTarget.checked)}
          />
           {useOverrideDate && (
            <DateInput
              value={overrideDate}
              onChange={setOverrideDate}
              maxDate={new Date()}
              label="Date"
              placeholder="Date input"
            />
          )}
        </Stack>
        <Divider mt="sm" mb="sm" color="black" />
        <Accordion variant="contained" mb="lg">
          {wellnessRatingCards}
        </Accordion>
        <Stack mb="lg">
          <Button onClick={onSubmitAllClick}>Submit All</Button>
          <Text fs="italic" size="xs" ta="center">Submits all entries as they are. If an entry is left blank, it will be submitted as such.</Text>
        </Stack>
        <AddTypologyCard />
      </div>
      <Divider />
      <div>
        <Text size="xl" fw={500} mb="sm">Logs</Text>
        <Accordion variant="separated">
          {wellnessRatingLogsList}
        </Accordion>
      </div>
    </main>
  )
}

export default RatingsPage;
