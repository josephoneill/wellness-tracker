import { Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { type TypologyFormValues, useTypologyForm } from '@/components/typology/useTypologyForm';

type Props = {
  onTypologyAdded: () => void
}

const TypologyForm = ({ onTypologyAdded }: Props) => {
  const { validateHealthCategory, submitTypology } = useTypologyForm();

  const form = useForm<TypologyFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      healthCategory: '',
    },
    validate: {
      healthCategory: validateHealthCategory,
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => submitTypology(values, onTypologyAdded))}>
      <TextInput
        label="Health Category"
        placeholder="Category"
        key={form.key('healthCategory')}
        {...form.getInputProps('healthCategory')}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  )
};

export default TypologyForm;