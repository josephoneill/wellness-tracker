import { Modal } from '@mantine/core';
import TypologyForm from '@/components/typology/TypologyForm';

type Props = {
  opened: boolean,
  close: () => void,
};

const AddTypologyModal = ({ opened, close }: Props) => {
  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Health Category" centered>
        <TypologyForm onTypologyAdded={close} />
      </Modal>
    </>
  )
};

export default AddTypologyModal;