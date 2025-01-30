import { useQuery } from "@tanstack/react-query";
import { getTypologies } from '@/api/typologyApi';
import { type Typology } from '@/components/typology/types';

export type TypologyFormValues = {
  healthCategory: string
}

export const useTypologies = () => {
  const { data: typologies, isLoading: isTypologiesLoading } = useQuery<Typology[], Error>({
    queryKey: ['typologies'],
    queryFn: getTypologies,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const getTypologyById = (typologyId: string) => {
    return typologies?.find(x => x.sk === typologyId);
  }

  return {
    typologies,
    isTypologiesLoading,
    getTypologyById,
  };
}