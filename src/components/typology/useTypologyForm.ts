import { addTypology } from '@/api/typologyApi';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';

export type TypologyFormValues = {
  healthCategory: string
}

export const useTypologyForm = () => {
  const queryClient = useQueryClient();

  const validateHealthCategory = (value: string): string|null => {
    let message;

    if (value === '') {
      message = 'Category cannot be empty';
    } else if (false) {
      message = 'Category already exists';
    } else {
      return null;
    }

    return message;
  }

  const submitTypology = async (values: TypologyFormValues, callback = () => {}) => {
    const { healthCategory } = values;
    try {
      await addTypology(healthCategory);
      onTypologyAdded(healthCategory, callback);
    } catch (error: unknown) {
      console.error((error as Error).message);
    }
  }

  const onTypologyAdded = (healthCategory: string, callback = () => {}) => {
    callback();
    notifications.show({
      title: 'Success!',
      message: `Your ${healthCategory} health category was created!`,
      color: 'red',
    });
    queryClient.invalidateQueries({ queryKey: ['typologies'] });
  }

  return {
    validateHealthCategory,
    submitTypology
  };
}