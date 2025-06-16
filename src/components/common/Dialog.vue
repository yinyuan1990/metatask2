<template>
    <div class="mm-modal">
        <div class="mm-box mm-modal-overlay mm-box--width-full mm-box--height-full mm-box--background-color-overlay-default"
            aria-hidden="true"></div>
        <div data-focus-guard="true" tabindex="0"
            style="width: 1px; height: 0px; padding: 0px; overflow: hidden; position: fixed; top: 1px; left: 1px;">
        </div>
        <div data-focus-lock-disabled="false">
            <div @click="onClose"
                class="mm-box mm-modal-content mm-box--padding-top-4 mm-box--sm:padding-top-8 mm-box--md:padding-top-12 mm-box--padding-right-4 mm-box--padding-bottom-4 mm-box--sm:padding-bottom-8 mm-box--md:padding-bottom-12 mm-box--padding-left-4 mm-box--display-flex mm-box--justify-content-center mm-box--align-items-flex-start mm-box--height-screen"
                style="padding: 0;display: flex; align-items: center; justify-content: center; width: 100%;left: 0;">
                <section @click="(e) => {
                    e.stopPropagation()
                }" :class="{
                    'mm-box mm-modal-content__dialog mm-modal-content__dialog--size-sm mm-box--padding-4 mm-box--display-flex mm-box--flex-direction-column mm-box--width-full mm-box--background-color-background-default mm-box--rounded-lg': true,
                    'mm-box--gap-4': showClose
                }" role="dialog" aria-modal="true" style="overflow-y: auto;">
                    <div class="mm-box mm-header-base mm-modal-header mm-box--display-flex mm-box--justify-content-space-between"
                        data-testid="srp-quiz-header">
                        <div class="mm-box" :style="{
                            ...headerCustomStyle,
                            'margin-left: 24px; width: calc(100% - 48px);': true
                        }">
                            <header style="color: var(--brand-colors-grey-grey400);"
                                class="mm-box mm-text mm-text--heading-sm mm-text--text-align-center mm-box--color-text-default">
                                <slot name="header"></slot>
                            </header>
                        </div>
                        <div v-if="showClose" @click="onClose"
                            class="mm-box mm-box--display-flex mm-box--justify-content-flex-end"
                            style="min-width: 24px;">
                            <button
                                class="mm-box mm-button-icon mm-button-icon--size-sm mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--color-icon-default mm-box--background-color-transparent mm-box--rounded-lg"
                                aria-label="关闭"><span
                                    class="mm-box mm-icon mm-icon--size-sm mm-box--display-inline-block mm-box--color-inherit"
                                    style="mask-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJtOTEgNDIxYzQgNCA4IDYgMTMgNiA2IDAgMTAtMiAxNC02bDEzOC0xMzggMTM4IDEzOGM0IDQgOCA2IDE0IDYgNSAwIDktMiAxMy02IDgtOCA4LTE5IDAtMjdsLTEzOC0xMzggMTM4LTEzOGM4LTggOC0xOSAwLTI3LTgtOC0xOS04LTI3IDBsLTEzOCAxMzgtMTM4LTEzOGMtOC04LTE5LTgtMjcgMC04IDgtOCAxOSAwIDI3bDEzOCAxMzgtMTM4IDEzOGMtOCA4LTggMTkgMCAyN3oiLz48L3N2Zz4K);"></span></button>
                        </div>
                    </div>
                    <span data-testid="srp_stage_introduction"></span>
                    <slot></slot>
                </section>
            </div>
        </div>
        <div data-focus-guard="true" tabindex="0"
            style="width: 1px; height: 0px; padding: 0px; overflow: hidden; position: fixed; top: 1px; left: 1px;">
        </div>
    </div>
</template>
<script>
export default {
    props: {
        headerCustomStyle: {
            type: Object,
            default: () => ({})
        },
        showClose: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        onClose() {
            this.$emit('onClose');
        }
    }
}
</script>