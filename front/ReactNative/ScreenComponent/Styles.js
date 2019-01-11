import {
    StyleSheet
} from 'react-native';
import {
    COLORS,
    TYPOGRAPHY,
    COMMON
} from '@CommonStyles';


export default StyleSheet.create({
    mainWrapper: {
        flex: 1
    },
    listStyle: {
        marginTop: 8,
        flex: 1,
    },
    search: {
        overflow: 'visible',
        ...COMMON.shadow
    },
    header: {
        backgroundColor: COLORS.blue.header,
        height: 64,
        paddingTop: 18,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    subHeader: {
        fontFamily: TYPOGRAPHY.fontFamily,
        fontSize: 17,
        color: COLORS.white,
        fontWeight: '500',
        marginLeft: 50,
        marginRight: 50
    },
    clientTitle: {
        fontFamily: TYPOGRAPHY.fontFamily,
        fontSize: 18,
        textAlign: 'center',
        color: COLORS.white,
        lineHeight: 21
    },
    fetchFailed: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fetchFailedTitle: {
        fontFamily: TYPOGRAPHY.fontFamily,
        color: COLORS.black,
        fontSize: 17,
        fontWeight: '500',
        marginBottom: 8
    },
    fetchFailedText: {
        textAlign: 'center',
        fontFamily: TYPOGRAPHY.fontFamily,
        color: '#4A4A4A',
        fontSize: 13,
        marginBottom: 24
    }
});