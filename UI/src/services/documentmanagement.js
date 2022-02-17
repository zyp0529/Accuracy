import { Document } from '@/services/api'
import { request, METHOD } from '@/utils/request'

/**
 * 文档页面
 * 获取文档表格数据
 * @param query  查新请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function DocumentDate(query) {
    return request(Document, METHOD.GET, query)
}

/**
 * 删除文档
 * @param id  查新请求参数
 * @param is_logic_del  是否是逻辑删除
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function DeleteDocuments(id, is_logic_del) {
    return request(Document, "DELETE", {
        ids: id,
        is_logic_del: is_logic_del
    })
}

/**
 * 文档页面
 *  编辑文档
 * @param form  查新请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function EditDate(form) {
    return request(Document, "PATCH", form)
}