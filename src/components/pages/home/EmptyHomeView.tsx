import { Loader, Stack, Text } from "@mantine/core";
import AddTypologyCard from "@/components/typology/AddTypology/AddTypologyCard";

type Props = {
  isLoading: boolean,
};

const EmptyHomeView = ({ isLoading }: Props) => {

  if (isLoading) {
    return (
      <Stack justify='center' align='center'>
        <Text>Loading Data</Text>
        <Loader />
      </Stack>
    )
  } else {
    return (
      <Stack justify='center' mt='lg'>
        <Text fw={500} ta="center">
          There's nothing here!
        </Text>
        <Text c='dimmed'>
          Begin tracking your health by adding a health category below.
        </Text>
        <AddTypologyCard />
      </Stack>
    )
  }
};

export default EmptyHomeView;