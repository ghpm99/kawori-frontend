import { Form, Input, Modal } from 'antd';

import styles from './ModalNew.module.scss';

export default function ModalNew(props) {

    const [form] = Form.useForm()

    const onOk = () => {
        form.submit()
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    }

    return (
        <Modal
            title='Nova entrada'
            visible={ props.visible }
            onCancel={ props.onCancel }
            okButtonProps={ { htmlType: 'submit' } }
            onOk={ onOk }
        >
            <Form
                { ...formItemLayout }
                form={ form }
                className={ styles.form }
                name='contract'
                onFinish={ props.onFinish }
                preserve={ false }
            >
                <Form.Item
                    label='Nome'
                    name='name'
                    rules={ [{ required: true, message: 'Entre com o nome da entrada' }] }
                >
                    <Input placeholder='Digite o nome' />
                </Form.Item>
            </Form>
        </Modal>
    )
}