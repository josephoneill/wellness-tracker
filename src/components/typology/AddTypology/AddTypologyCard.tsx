import { Card, Group, Text, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AddTypologyModal from '@/components/typology/AddTypology/AddTypologyModal';

const AddTypologyCard = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Group justify='space-between' mb='xs'>
        <Text fw={500}>Add Health Category</Text>
      </Group>

      <Text size='sm' c='dimmed'>
        A health category is a unique aspect of your health that you would like to track.
      </Text>

      <Text size='sm' c='dimmed' mt='sm'>
        For example, <span className='bold'>eyes</span>, <span className='bold'>head</span>, <span className='bold'>sleep</span>, etc.
      </Text>

      <Button mt='lg' onClick={open}>Add</Button>
    </Card>

    <AddTypologyModal opened={opened} close={close} />
    </>
  )
};

export default AddTypologyCard;