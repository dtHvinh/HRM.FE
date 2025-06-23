"use client";

import { setAuth } from "@/context/AuthProvider";
import { post } from "@/util/api";
import { Alert, Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) =>
        value.length < 3 ? "Tên đăng nhập phải có ít nhất 3 ký tự" : null,
      password: (value) =>
        value.length < 3 ? "Mật khẩu phải có ít nhất 5 ký tự" : null,
    },
  });
  const handleSubmit = async (values: typeof form.values) => {
    try {
      setError("");
      setLoading(true);

      const response: { accessToken: string } = await post(
        "/api/auth/login",
        JSON.stringify(values)
      );

      setAuth(response.accessToken);
      router.push("/");
    } catch (err) {
      setError("Tên đăng nhập hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = () => {
    // Set a special token for anonymous users
    setAuth("anonymous");
    router.push("/");
  };
  return (
    <div className="max-w-[420px] mx-auto my-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        Chào Mừng Đến Với Hệ Thống HRM
      </h1>

      <p className="text-sm text-gray-500 text-center mb-8">
        Đăng nhập để truy cập tài khoản của bạn
      </p>

      <div className="bg-white border rounded-lg shadow-sm p-8 mt-8">
        {error && (
          <Alert color="red" mb="md" title="Lỗi Xác Thực" variant="light">
            {error}
          </Alert>
        )}{" "}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Tên Đăng Nhập"
            required
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="Mật Khẩu"
            required
            className="mt-4"
            {...form.getInputProps("password")}
          />{" "}
          <Button fullWidth className="mt-6" type="submit" loading={loading}>
            Đăng Nhập
          </Button>
        </form>{" "}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mb-2">hoặc</p>
          <Button
            fullWidth
            variant="outline"
            onClick={handleAnonymousLogin}
            disabled={loading}
          >
            Tiếp Tục Với Tư Cách Khách
          </Button>
        </div>
      </div>
    </div>
  );
}
