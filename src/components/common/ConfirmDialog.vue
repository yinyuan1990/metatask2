<template>
    <Dialog :showClose="false" @onClose="onClose">
        <div class="modal__content" tabindex="-1"
            style="animation-duration: 0.3s; animation-name: anim_11750061050223; animation-timing-function: ease-out; border-radius: 8px;">
            <div class="modal-container">
                <div class="modal-container__content" style="padding: 0;">
                    <div class="modal-content" style="padding: 0;">
                        <div class="modal-content__title" style="font-size: var(--font-size-5);">
                            <slot name="title"></slot>
                        </div>
                        <div class="modal-content__description" style="padding-bottom: 16px;">
                            <slot></slot>
                        </div>
                    </div>
                </div>
                <div v-if="!noFoot" class="modal-container__footer" style="display: flex; column-gap: 12px;"><button
                        class="button btn--rounded btn-secondary modal-container__footer-button"
                        @click="onClose">取消</button><button
                        class="button btn--rounded btn-danger-primary modal-container__footer-button" @click="onReset">
                        <slot name="confirm-btn-text"></slot>
                    </button></div>
            </div>
        </div>
    </Dialog>
</template>
<script>
import Dialog from "@/components/common/Dialog.vue";
export default {
    name: "ResetDialog",
    props: {
        noFoot: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Dialog
    },
    methods: {
        onReset() {
            this.onClose()
        },
        onClose() {
            this.$emit('close');
        }
    }
}
</script>