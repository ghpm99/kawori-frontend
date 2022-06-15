import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { savePaymentDetailService, payoffPaymentService } from '../../../../../services/financialService'
import { fetchPaymentDetails, changeNamePaymentDetails, changeTypePaymentDetails, changeFixedPaymentDetails, changeActivePaymentDetails, changePaymentDatePaymentDetails, changeValuePaymentDetails } from '../../../../../store/features/financial/Index'
import { RootState, useAppDispatch } from '../../../../../store/store'


const usePaymentDetails = () => {

    const router = useRouter()
    const { id } = router.query

    const financialStore = useSelector((state: RootState) => state.financial.paymentDetail)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (id) {
            const idPayment = parseInt(id as string)
            dispatch(fetchPaymentDetails(idPayment))
        }
    }, [id])

    const date = new Date(financialStore.data?.date).toLocaleDateString()

    const save = (event) => {
        savePaymentDetailService(id, financialStore.data)
    }

    const changeName = (event) => {
        dispatch(changeNamePaymentDetails(event))
    }

    const changeType = (event) => {
        dispatch(changeTypePaymentDetails(event))
    }

    const changeFixed = (event) => {
        const { checked } = event.target
        dispatch(changeFixedPaymentDetails(checked))
    }

    const changeActive = (event) => {
        const { checked } = event.target
        dispatch(changeActivePaymentDetails(checked))
    }

    const changePaymentDate = (date) => {
        dispatch(changePaymentDatePaymentDetails(date.format('YYYY-MM-DD')))
    }

    const changeValue = (event) => {
        dispatch(changeValuePaymentDetails(event))
    }

    const payoff = (event) => {
        payoffPaymentService(financialStore.data.id).then(data => {
            console.log(data)
            dispatch(fetchPaymentDetails(financialStore.data.id))
        })
    }

    return {
        financialStore,
        date,
        save,
        changeName,
        changeType,
        changeFixed,
        changeActive,
        changePaymentDate,
        changeValue,
        payoff,
    }
}

export default usePaymentDetails