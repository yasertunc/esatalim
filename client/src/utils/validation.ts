export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Geçerli bir e-posta adresi giriniz'
  },
  password: {
    required: true,
    minLength: 6,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Şifre en az 6 karakter olmalı ve en az bir küçük harf, bir büyük harf ve bir rakam içermelidir'
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: 'İsim 2-50 karakter arasında olmalıdır'
  },
  phone: {
    pattern: /^(\+90|0)?[5][0-9]{9}$/,
    message: 'Geçerli bir Türk telefon numarası giriniz'
  },
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: 'Başlık 3-100 karakter arasında olmalıdır'
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    message: 'Açıklama 10-1000 karakter arasında olmalıdır'
  },
  price: {
    required: true,
    pattern: /^\d+(\.\d{1,2})?$/,
    message: 'Geçerli bir fiyat giriniz'
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: 'Şehir 2-50 karakter arasında olmalıdır'
  },
  district: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: 'İlçe 2-50 karakter arasında olmalıdır'
  }
};

export const validateEmail = (email: string): boolean => {
  return VALIDATION_RULES.email.pattern.test(email);
};

export const validatePassword = (password: string): boolean => {
  return VALIDATION_RULES.password.pattern.test(password) && 
         password.length >= VALIDATION_RULES.password.minLength;
};

export const validatePhone = (phone: string): boolean => {
  return VALIDATION_RULES.phone.pattern.test(phone);
};

export const validatePrice = (price: string | number): boolean => {
  const priceStr = price.toString();
  return VALIDATION_RULES.price.pattern.test(priceStr) && parseFloat(priceStr) > 0;
};
