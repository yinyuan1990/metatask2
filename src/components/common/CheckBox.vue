<template>
    <div class="mm-box mm-box--display-flex mm-box--gap-2 mm-box--align-items-center">
        <label
            class="mm-box mm-text mm-checkbox mm-text--body-md mm-box--display-inline-flex mm-box--align-items-center mm-box--color-text-default"
            for="basic-configuration-checkbox">
            <span class="mm-checkbox__input-wrapper">
                <input :class="{
                    'mm-box--border-color-border-default mm-box mm-checkbox__input mm-box--margin-0 mm-box--margin-right-0 mm-box--display-flex mm-box--rounded-sm mm-box--border-width-2 box--border-style-solid': true,
                    'mm-box--background-color-primary-default mm-box--border-color-primary-default mm-checkbox__input--checked': checked
                }" type="checkbox" v-model="checked" title="basic-configuration-checkbox"
                    id="basic-configuration-checkbox">
                <span v-if="checked"
                    class="mm-box mm-checkbox__icon mm-icon mm-icon--size-md mm-box--display-inline-block mm-box--color-primary-inverse"
                    style="mask-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJtNDEyIDE0NWMxMiAxMiAxMiAzMiAwIDQ1bC0xODUgMTgzYy0xMiAxMi0zMiAxMi00NSAwbC04MS04MGMtMTMtMTMtMTMtMzMgMC00NiAxMi0xMiAzMi0xMiA0NSAwbDU5IDU4IDE2MS0xNjFjMTMtMTIgMzMtMTIgNDYgMXoiLz48L3N2Zz4K);">
                </span>
            </span>
        </label>
        <label
            class="mm-box mm-text mm-label mm-label--html-for mm-text--body-sm mm-text--font-weight-normal mm-box--display-inline-flex mm-box--align-items-center mm-box--color-text-default"
            for="basic-configuration-checkbox">
            <slot></slot>
        </label>
    </div>
</template>
<script>
export default {
    name: 'MCheckBox',
    data() {
        return {
            checked: false
        }
    },
    watch: {
        checked() {
            this.$emit('onCheckChange', this.checked)
        }
    }
}
</script>
<style lang="css" scoped>
.mm-checkbox__input:hover:not(:disabled) {
    border-color: var(--color-border-default);
}

.mm-checkbox__input--checked {
    border-color: var(--color-primary-alternative) !important;
}
</style>