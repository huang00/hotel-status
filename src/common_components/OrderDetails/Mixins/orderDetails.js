import Head from '../components/Head/'
import SuborderItem from '../components/SuborderItem/'
import OtherCast from '../components/OtherCast/'
import Remark from '../components/Remark/'
import FinanceItem from '../components/FinanceItem/'
import Foot from '../components/Foot/'
import OrderButtons from '../../OrderButtons/'
import { toDecimal2 } from 'common_libs/util'

export default {
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    components: {
        Head,
        SuborderItem,
        OtherCast,
        Remark,
        FinanceItem,
        Foot,
        OrderButtons
    },
    data () {
        return {
            toDecimal2
        }
    },
    methods: {
        handlerEventType (eventType, payload) {
            this.$emit(`on-${eventType}`, payload)
        }
    }
}