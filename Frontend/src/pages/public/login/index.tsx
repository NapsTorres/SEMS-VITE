import { Button, Form, Input } from 'antd';
import useLogin from './useLogin';

export const LoginPage = () => {
    const {
        form,
        handleLogin,
        loading
    } = useLogin()
    return (
      <div 
        className="flex items-center justify-center min-h-screen relative"
        style={{ 
          backgroundImage: 'url("./sports.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        {/* Login form */}
        <div className="max-w-md w-full shadow-md rounded-lg p-6 z-10" style={{ backgroundColor: '#e9ece4' }}>
          <div className="flex justify-center mb-4">
            <img src="https://i.imgur.com/hzUP28s.png" alt="Logo" className="w-20 h-20" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Login</h2>
          <Form layout='vertical' form={form} onFinish={handleLogin}>
            <Form.Item name='username' label={<span className="text-gray-700">Username</span>}>
                <Input />
            </Form.Item>
            <Form.Item name='password' label={<span className="text-gray-700">Password</span>}>
                <Input.Password />
            </Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              style={{ backgroundColor: '#064518', borderColor: '#064518' }}
              className="w-full p-2 text-white rounded hover:opacity-90"
            >
              Login
            </Button>
          </Form>
        </div>
      </div>
    );
}
