import { Accountmanagement, ROLES, RoleAccount, GetOneAccountmanagement } from '@/services/api'
import { request, METHOD } from '@/utils/request'

/**
 * 账号管理页面
 * 获取账号表格数据
 * @param query  查新请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function AccountDate(query) {
    return request(Accountmanagement, METHOD.GET, query)
}

/**
 * 账号管理页面
 * 获取角色下拉框数据
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function GetDownmenutDate() {
    return request(ROLES, METHOD.GET, '')
}

/**
 * 账号管理页面
 * 添加账号
 * @param from  查新请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function AddAccount(from) {
    return request(Accountmanagement, METHOD.POST, from)
}

/**
 * 账号管理页面
 * 添加账号对应角色
 * @param from  查新请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function AddAccountRole(from) {
    return request(RoleAccount, METHOD.POST, from)
}

/**
 * 账号管理页面
 * 删除账号对应角色
 * @param from  查新请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function DeleteAccountRole(from) {
    return request(RoleAccount, 'DELETE1', from)
}

/**
 * 账号管理页面
 * 编辑账号
 * @param from  查新请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function EditAccount(from) {
    return request(Accountmanagement, "PATCH", from)
}
/**
 * 账号管理页面
 * 获取单个账号数据
 * @param id  查新请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function GetOngAccountDate(id) {
    return request(GetOneAccountmanagement, METHOD.GET, {
        account_id: id
    })
}

/**
 * 账号管理页面
 * 删除账号数据
 * @param id  查新请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function DeleteDate(id) {
    return request(Accountmanagement, "DELETE", {
        ids: id
    })
}