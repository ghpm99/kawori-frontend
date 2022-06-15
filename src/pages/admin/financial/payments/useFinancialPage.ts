import moment from 'moment'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { changeVisibleModal, fetchAllPayment, saveNewPayment } from '../../../../store/features/financial/Index'
import { RootState, useAppDispatch } from '../../../../store/store'


const useFinancialPage = () => {


    const financialStore = useSelector((state: RootState) => state.financial.payments)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchAllPayment({
            active: true,
            status: 0
        }))
    }, [])

    const openModal = (modal) => {
        dispatch(changeVisibleModal({ modal: modal, visible: true }))
    }

    const closeModal = (modal) => {
        dispatch(changeVisibleModal({ modal: modal, visible: false }))
    }

    const onFinish = (values) => {
        const newPayment = {
            'type': values.type,
            'name': values.name,
            'date': moment(values.date).format('YYYY-MM-DD'),
            'installments': values.installments,
            'payment_date': moment(values.payment_date).format('YYYY-MM-DD'),
            'fixed': values.fixed ? true : false,
            'value': values.value
        }
        dispatch(saveNewPayment({ payment: newPayment }))
        closeModal('newPayment')
        dispatch(fetchAllPayment({
            active: true,
            status: 0
        }))
    }

    const setFilters = (values) => {

        let date__gte
        let date__lte
        let payment_date__gte
        let payment_date__lte

        if (values.date) {
            date__gte = values.date[0]?.toISOString().slice(0, 10)
            date__lte = values.date[1]?.toISOString().slice(0, 10)
        }
        if (values.payment_date) {
            payment_date__gte = values.payment_date[0]?.toISOString().slice(0, 10)
            payment_date__lte = values.payment_date[1]?.toISOString().slice(0, 10)
        }

        const filters: financialFilter = {
            status: values.status,
            type: values.type,
            name__icontains: values.name,
            date__gte: date__gte,
            date__lte: date__lte,
            installments: values.installments,
            payment_date__gte: payment_date__gte,
            payment_date__lte: payment_date__lte,
            fixed: values.fixed,
            active: values.active
        }
        dispatch(fetchAllPayment(filters))
        closeModal('modalFilters')
    }

    return {
        financialStore,
        openModal,
        onFinish,
        setFilters,
        closeModal,
    }
}

export default useFinancialPage