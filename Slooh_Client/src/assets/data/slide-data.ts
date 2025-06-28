import { CachTrinhBay, LoaiSlide } from '@/types'

export const listThemes = [
  {
    section: 'Phổ biến',
    list: [
      {
        id: 1,
        name: 'Tiêu chuẩn',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744650787/Slooh-theme/theme-spring_kzdjht.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744650787/Slooh-theme/theme-spring_kzdjht.webp',
      },
      {
        id: 2,
        name: 'Mùa hè',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744650788/Slooh-theme/theme-summer_iylowb.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744650788/Slooh-theme/theme-summer_iylowb.webp',
      },
      {
        id: 3,
        name: 'Mùa thu',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744650786/Slooh-theme/theme-autumn_mot9cw.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744650786/Slooh-theme/theme-autumn_mot9cw.webp',
      },
      {
        id: 4,
        name: 'Mùa đông',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744650789/Slooh-theme/theme-winter_qqva2u.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744650789/Slooh-theme/theme-winter_qqva2u.webp',
      },
      {
        id: 5,
        name: 'Công nghệ',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825607/Theme-bg/theme-technology_ya6hco.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825607/Theme-bg/theme-technology_ya6hco.webp',
      },
      {
        id: 6,
        name: 'Hùng vĩ',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825611/Theme-bg/bg-image-4_w8bkto.jpg',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825611/Theme-bg/bg-image-4_w8bkto.jpg',
      },
    ],
  },
  {
    section: 'Thể thao',
    list: [
      {
        id: 27,
        name: 'Bóng đá',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825329/Theme-bg/theme-soccer_fawxcc.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825329/Theme-bg/theme-soccer_fawxcc.webp',
      },
      {
        id: 28,
        name: 'Bóng rổ',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825615/Theme-bg/theme-basketball_haxpme.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825615/Theme-bg/theme-basketball_haxpme.webp',
      },
      {
        id: 29,
        name: 'Bơi lội',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825606/Theme-bg/theme-swimming_dew7uy.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825606/Theme-bg/theme-swimming_dew7uy.webp',
      },
      {
        id: 30,
        name: 'Golf',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825621/Theme-bg/theme-golf_posijs.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825621/Theme-bg/theme-golf_posijs.webp',
      },
      {
        id: 31,
        name: 'Tennis',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825608/Theme-bg/theme-tennis_bzlevr.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825608/Theme-bg/theme-tennis_bzlevr.webp',
      },
      {
        id: 32,
        name: 'Điền kinh',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744827580/Theme-bg/theme-athletic_wkllrn.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744827580/Theme-bg/theme-athletic_wkllrn.webp',
      },
    ],
  },
  {
    section: 'Chuyên nghiệp',
    list: [
      // Mau toi

      {
        id: 21,
        name: 'Tối',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825617/Theme-bg/theme-dark_xntdud.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825617/Theme-bg/theme-dark_xntdud.webp',
      },
      {
        id: 22,
        name: 'Nâu tối',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744827219/Theme-bg/theme-dark-brown_nvovib.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744827219/Theme-bg/theme-dark-brown_nvovib.webp',
      },
      {
        id: 23,
        name: 'Xanh tối',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825618/Theme-bg/theme-dark-blue_bcl8v7.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825618/Theme-bg/theme-dark-blue_bcl8v7.webp',
      },
      {
        id: 24,
        name: 'Xanh lá tối',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825620/Theme-bg/theme-dark-green_vprowu.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825620/Theme-bg/theme-dark-green_vprowu.webp',
      },
      {
        id: 25,
        name: 'Đỏ tối',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825620/Theme-bg/theme-dark-red_x5pjpk.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825620/Theme-bg/theme-dark-red_x5pjpk.webp',
      },
      {
        id: 26,
        name: 'Tím tối',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825613/Theme-bg/dark-purple_rbvoey.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825613/Theme-bg/dark-purple_rbvoey.webp',
      },

      // Co ban

      {
        id: 15,
        name: 'Xanh lá',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825622/Theme-bg/theme-green_paqavy.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825622/Theme-bg/theme-green_paqavy.webp',
      },
      {
        id: 16,
        name: 'Xanh dương',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825616/Theme-bg/theme-blue_kvzfne.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825616/Theme-bg/theme-blue_kvzfne.webp',
      },
      {
        id: 17,
        name: 'Đỏ',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825328/Theme-bg/theme-red_dcp1lx.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825328/Theme-bg/theme-red_dcp1lx.webp',
      },
      {
        id: 18,
        name: 'Tím',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825327/Theme-bg/theme-purple_dply6a.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825327/Theme-bg/theme-purple_dply6a.webp',
      },
      {
        id: 19,
        name: 'Vàng',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825609/Theme-bg/theme-yellow_pwsqcl.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825609/Theme-bg/theme-yellow_pwsqcl.webp',
      },
      {
        id: 20,
        name: 'Cam',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825326/Theme-bg/theme-orange_nsnved.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825326/Theme-bg/theme-orange_nsnved.webp',
      },

      // Mau sang
      {
        id: 13,
        name: 'Sáng',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825623/Theme-bg/theme-light_gnyjhb.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825623/Theme-bg/theme-light_gnyjhb.webp',
      },
      {
        id: 8,
        name: 'Xanh sáng',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825625/Theme-bg/theme-light-blue_zjeled.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825625/Theme-bg/theme-light-blue_zjeled.webp',
      },
      {
        id: 9,
        name: 'Xanh lá sáng',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825323/Theme-bg/theme-light-green_mxusdq.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825323/Theme-bg/theme-light-green_mxusdq.webp',
      },
      {
        id: 11,
        name: 'Tím sáng',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825325/Theme-bg/theme-light-purple_gogrs5.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825325/Theme-bg/theme-light-purple_gogrs5.webp',
      },
      {
        id: 12,
        name: 'Vàng sáng',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825325/Theme-bg/theme-light-yellow_zl3j17.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825325/Theme-bg/theme-light-yellow_zl3j17.webp',
      },
      {
        id: 14,
        name: 'Cam sáng',
        image: 'https://res.cloudinary.com/dzdfgj03g/image/upload/w_300/v1744825324/Theme-bg/theme-light-orange_cswyuc.webp',
        linkBackground: 'https://res.cloudinary.com/dzdfgj03g/image/upload/v1744825324/Theme-bg/theme-light-orange_cswyuc.webp',
      },

    ],
  },
]
