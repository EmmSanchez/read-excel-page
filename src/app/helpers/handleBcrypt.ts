import bcrypt from 'bcryptjs'

const encrypt = async (textPlain: string) => {
  const hash = await bcrypt.hash(textPlain, 10)
  return hash
}

const compare = async (passwordPlain: string, hashPassword: string) => {
  return await bcrypt.compare(passwordPlain, hashPassword)
}