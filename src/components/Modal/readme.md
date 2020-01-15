
### Examples

```jsx
import { Button, ModalHeader, ModalBody } from '@oris/ui';

const MyModal = (props) => {
    let modal = React.createRef();

    const showModal = () => modal.current.show();

    return (
        <>
            <Modal ref={modal} keyboard={true} backdrop="static">
                <ModalHeader hasCloseButton={true}>
                    Modal Title
                </ModalHeader>
                <ModalBody>
                    Your content goes here
                </ModalBody>
            </Modal>

            <Button theme="primary" onClick={showModal}>
                Show Modal
            </Button>
        </>
    );
};

<MyModal />
```