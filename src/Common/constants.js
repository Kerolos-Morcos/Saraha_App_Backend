
const genderEnum = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other'
}

const roleEnum = {
    USER: 'user',
    ADMIN: 'admin'
}

const tokenTypeEnum = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token'
}

const providersEnum = {
    SYSTEM: 'system',
    GOOGLE: 'google'
}

const OTPExpirationTime = 300;

const allowedExtensions = {
 image: ['png', 'jpeg'],
 video: ['mp4'],
 application: ['xlsx', 'pdf']
}


export { genderEnum, roleEnum, tokenTypeEnum, providersEnum, OTPExpirationTime, allowedExtensions };