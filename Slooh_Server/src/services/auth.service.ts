import { LoaiMa as TokenType, NGUOIDUNG as User } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import { AuthTokensResponse } from '../types/response';
import ApiError from '../utils/ApiError';
import { encryptPassword, isPasswordMatch } from '../utils/encryption';
import exclude from '../utils/exclude';
import tokenService from './token.service';
import userService from './user.service';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Omit<User, 'password'>>}
 */
const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<Omit<User, 'matKhau'>> => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await isPasswordMatch(password, user.matKhau as string))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email hoặc mật khẩu không chính xác');
  }

  // Check if user account is locked
  if (user.trangThai === 'KHOA') {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.'
    );
  }

  return exclude(user, ['matKhau']);
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenData = await prisma.mA.findFirst({
    where: {
      ma: refreshToken,
      loaiMa: TokenType.REFRESH,
      daSuDung: false
    }
  });
  if (!refreshTokenData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy');
  }
  await prisma.mA.delete({ where: { maMa: refreshTokenData.maMa } });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<AuthTokensResponse>}
 */
const refreshAuth = async (refreshToken: string): Promise<AuthTokensResponse> => {
  try {
    const refreshTokenData = await tokenService.verifyToken(refreshToken, TokenType.REFRESH);
    const { maNguoiDung } = refreshTokenData;
    await prisma.mA.delete({ where: { maMa: refreshTokenData.maMa } });
    return tokenService.generateAuthTokens({ maNguoiDung });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Vui lòng xác thực');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenData = await tokenService.verifyToken(
      resetPasswordToken,
      TokenType.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenData.maNguoiDung);
    if (!user) {
      throw new Error();
    }
    const encryptedPassword = await encryptPassword(newPassword);
    await userService.updateUserById(user.maNguoiDung, { matKhau: encryptedPassword });
    await prisma.mA.deleteMany({
      where: { maNguoiDung: user.maNguoiDung, loaiMa: TokenType.RESET_PASSWORD }
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Đặt lại mật khẩu không thành công');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<void>}
 */
const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  try {
    const verifyEmailTokenData = await tokenService.verifyToken(
      verifyEmailToken,
      TokenType.VERIFY_EMAIL
    );
    await prisma.mA.deleteMany({
      where: { maNguoiDung: verifyEmailTokenData.maNguoiDung, loaiMa: TokenType.VERIFY_EMAIL }
    });
    await userService.updateUserById(verifyEmailTokenData.maNguoiDung, { daXacThucEmail: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Xác thực email không thành công');
  }
};

/**
 * Find or create user
 * @param {string} email
 * @param {string} name
 * @returns {Promise<User>}
 */

const findOrCreateUser = async (
  accessToken: string,
  profile: any
): Promise<Omit<User, 'matKhau'>> => {
  const oauthId = profile.id;
  const email = profile.emails?.[0]?.value;
  const name = profile.displayName;
  const avatar = profile.photos?.[0]?.value;

  const oauthUser = await prisma.oAUTH.findUnique({
    where: { oauthId },
    include: { nguoiDung: true }
  });

  if (oauthUser) {
    return oauthUser.nguoiDung;
  }

  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email không hợp lệ');
  }

  const existingUser = await prisma.nGUOIDUNG.findUnique({
    where: { email }
  });
  if (existingUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Email này đã được đăng ký bằng phương thức khác. Vui lòng đăng nhập bằng email và mật khẩu.'
    );
  } else {
    const newUser = await prisma.nGUOIDUNG.create({
      data: {
        email,
        hoTen: name,
        matKhau: await encryptPassword('GOOGLE_AUTH_PASSWORD'),
        anhDaiDien: avatar,
        daXacThucEmail: true
      }
    });

    await prisma.oAUTH.create({
      data: {
        oauthId,
        loaiOAuth: 'GOOGLE',
        ma: accessToken,
        nguoiDung: {
          connect: { maNguoiDung: newUser.maNguoiDung }
        }
      }
    });

    return newUser;
  }
};

export default {
  loginUserWithEmailAndPassword,
  isPasswordMatch,
  encryptPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  findOrCreateUser
};
