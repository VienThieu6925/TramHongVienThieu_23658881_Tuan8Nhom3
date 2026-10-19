const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Errors = { email?: string; password?: string; confirm?: string };

export function validate(
  values: { email: string; password: string; confirm?: string },
  mode: 'login' | 'register'
): Errors {
  const errors: Errors = {};

  if (!values.email.trim()) errors.email = 'Vui lòng nhập email';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Email không đúng định dạng';

  if (!values.password) errors.password = 'Vui lòng nhập mật khẩu';
  else if (values.password.length < 6) errors.password = 'Mật khẩu tối thiểu 6 ký tự';

  if (mode === 'register') {
    if (!values.confirm) errors.confirm = 'Vui lòng nhập lại mật khẩu';
    else if (values.confirm !== values.password) errors.confirm = 'Mật khẩu nhập lại không khớp';
  }
  return errors;
}