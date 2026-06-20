import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Button, List, Checkbox, Modal, Form, Input, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [form] = Form.useForm();

    const fetchTasks = async () => {
        try {
            const { data } = await API.get('/tasks');
            setTasks(data);
        } catch (error) {
            message.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleFinish = async (values) => {
        try {
            if (editingTask) {
                const { data } = await API.put(`/tasks/${editingTask._id}`, values);
                setTasks(tasks.map(t => t._id === data._id ? data : t));
                message.success('Task updated');
            } else {
                const { data } = await API.post('/tasks', values);
                setTasks([data, ...tasks]);
                message.success('Task created');
            }
            closeModal();
        } catch (error) {
            message.error(error.response?.data?.message || 'Action failed');
        }
    };

    const toggleComplete = async (task) => {
        try {
            const { data } = await API.put(`/tasks/${task._id}`, { completed: !task.completed });
            setTasks(tasks.map(t => t._id === data._id ? data : t));
        } catch (error) {
            message.error('Failed to update status');
        }
    };

    const deleteTask = async (id) => {
        try {
            await API.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
            message.success('Task deleted');
        } catch (error) {
            message.error('Failed to delete task');
        }
    };

    const openModal = (task = null) => {
        setEditingTask(task);
        if (task) {
            form.setFieldsValue({ title: task.title, description: task.description });
        } else {
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        form.resetFields();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium">Hello, {user?.name}</span>
                    <Button type="text" danger icon={<LogoutOutlined />} onClick={logout}>
                        Logout
                    </Button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} className="bg-blue-600">
                        Add Task
                    </Button>
                </div>

                <List
                    className="bg-white rounded-lg shadow-sm"
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={tasks}
                    bordered
                    renderItem={(task) => (
                        <List.Item
                            actions={[
                                <Button type="text" icon={<EditOutlined />} onClick={() => openModal(task)} />,
                                <Popconfirm
                                    title="Delete this task?"
                                    onConfirm={() => deleteTask(task._id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="text" danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Checkbox checked={task.completed} onChange={() => toggleComplete(task)} />}
                                title={<span className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</span>}
                                description={task.description}
                            />
                        </List.Item>
                    )}
                />
            </main>

            <Modal
                title={editingTask ? "Edit Task" : "Create New Task"}
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
                    <Form.Item name="title" rules={[{ required: true, message: 'Please input a title!' }]}>
                        <Input placeholder="Task Title" size="large" />
                    </Form.Item>
                    <Form.Item name="description">
                        <Input.TextArea placeholder="Description (optional)" rows={3} />
                    </Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button onClick={closeModal}>Cancel</Button>
                        <Button type="primary" htmlType="submit" className="bg-blue-600">
                            {editingTask ? "Update" : "Create"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}