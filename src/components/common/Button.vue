<template>
    <button :style="customStyle" :class='{
        "mm-box mm-text mm-button-base mm-button-base--size-lg  mm-button-primary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-inverse mm-box--background-color-primary-default mm-box--rounded-pill": true,
        "mm-button-primary--disabled mm-button-base--disabled": disabled
    }' data-theme="light" @click="onClickBtn">
        <slot></slot>
    </button>
</template>
<script>
export default {
    name: "MButton",
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        customStyle: {
            type: Object,
            required: false,
            default() {
                return {}
            }
        },
        onClickBtn: {
            type: Function,
            required: true
        }
    }
}
</script>
<style lang="css" scoped>
/* .mm-button-primary--disabled:active {
    background-color: #fff;
} */
</style>