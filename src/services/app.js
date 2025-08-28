// import axios from '../axiosConfig'
import axiosDefault from 'axios'
export const apiGetPublicProvinces = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosDefault({
                method: 'get',
                url: 'https://provinces.open-api.vn/api/p/',
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
export const apiGetPublicDistrict = (provinceId) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosDefault({
                method: 'get',
                url: `https://provinces.open-api.vn/api/p/${provinceId}?depth=2`,
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
export const apiGetPublicWard = (districtID) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosDefault({
                method: 'get',
                url: `https://provinces.open-api.vn/api/d/${districtID}?depth=2`,
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
