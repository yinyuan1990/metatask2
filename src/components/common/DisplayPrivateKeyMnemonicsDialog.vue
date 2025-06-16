<template>
    <Dialog @onClose="onClose">
        <template v-slot:header>
            {{
                !step ? '安全问答' : `${step}/${totalStep}`
            }}
        </template>
        <template v-if="!step && !showError && !showRight">
            <div class="mm-box mm-box--margin-auto mm-box--display-flex mm-box--text-align-center"><img :src="Img"
                    alt="一只眼睛，中央有一个钥匙孔，还有三个浮动密码字段" width="300" style="max-width: 100%;"></div>
            <p class="mm-box mm-text mm-text--body-lg-medium mm-text--text-align-center">要查看私钥助记词，您需要答对两个问题
            </p>
        </template>
        <template v-else-if="step === 1 && !showError && !showRight">
            <p class="mm-box mm-text mm-text--body-lg-medium mm-text--text-align-center">
                如果您丢失了私钥助记词，MetaMask...</p>
            <button @click="onChooseAnswer(1)"
                class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-secondary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-default mm-box--background-color-transparent mm-box--rounded-pill mm-box--border-color-primary-default box--border-style-solid box--border-width-1"
                data-testid="srp-quiz-wrong-answer">可以为您找回来</button>
            <button @click="onChooseAnswer(2)"
                class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-secondary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-default mm-box--background-color-transparent mm-box--rounded-pill mm-box--border-color-primary-default box--border-style-solid box--border-width-1"
                data-testid="srp-quiz-right-answer">无法帮助您</button>
        </template>
        <template v-else-if="step === 2 && !showError && !showRight">
            <p class="mm-box mm-text mm-text--body-lg-medium mm-text--text-align-center">
                如果有人（即使是技术支持人员）查问您的私钥助记词...</p>
            <button @click="onChooseAnswer(1)"
                class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-secondary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-default mm-box--background-color-transparent mm-box--rounded-pill mm-box--border-color-primary-default box--border-style-solid box--border-width-1"
                data-testid="srp-quiz-right-answer">就是在对您进行欺诈</button>
            <button @click="onChooseAnswer(2)"
                class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-secondary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-default mm-box--background-color-transparent mm-box--rounded-pill mm-box--border-color-primary-default box--border-style-solid box--border-width-1"
                data-testid="srp-quiz-right-answer">您应该交给他们</button>
        </template>
        <template v-else-if="showError && !showRight">
            <div
                class="mm-box mm-box--display-flex mm-box--flex-direction-row mm-box--justify-content-center mm-box--align-items-center">
                <span
                    class="mm-box mm-icon mm-icon--size-xl mm-box--display-inline-block mm-box--text-align-center mm-box--width-1/12 mm-box--color-error-default"
                    style="mask-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj4KICA8cGF0aCBkPSJtMjUyIDUxYy0xMTMgMC0yMDUgOTItMjA1IDIwNSAwIDExMyA5MiAyMDUgMjA1IDIwNSAxMTIgMCAyMDQtOTIgMjA0LTIwNSAwLTExMy05Mi0yMDUtMjA0LTIwNXogbS0xNiAxMjNjMC04IDctMTUgMTYtMTUgOCAwIDE1IDcgMTUgMTVsMCAxMDJjMCA5LTcgMTYtMTUgMTYtOSAwLTE2LTctMTYtMTZ6IG0zNCAxNzJjLTEgMi0yIDQtNCA2LTIgMi00IDQtNyA1LTIgMS01IDEtNyAxLTMgMC02IDAtOC0xLTMtMS01LTMtNy01LTItMi0zLTQtNC02LTEtMy0yLTUtMi04IDAtMyAxLTUgMi04IDEtMiAyLTUgNC03IDItMSA0LTMgNy00IDUtMiAxMC0yIDE1IDAgMyAxIDUgMyA3IDQgMiAyIDMgNSA0IDcgMSAzIDIgNSAyIDggMCAzLTEgNS0yIDh6Ii8+Cjwvc3ZnPgo=);"></span>
            </div>
            <p class="mm-box mm-text mm-text--body-lg-medium mm-text--text-align-center mm-box--color-error-default">
                {{
                    step === 2 ? '不！永远不要与任何人分享您的私钥助记词' : '答错了！没有人能够帮您找回您的私钥助记词'
                }}
            </p>
            <p class="mm-box mm-text mm-text--body-md mm-text--text-align-center mm-box--color-text-default">
                {{ step === 2 ? '任何声称需要您的私钥助记词的人都在对您进行欺诈。如果您与他们分享助记词，他们就会偷窃您的资产。' :
                    '一旦遗失私钥助记词，它将永远消失。无论他人如何保证，无人能够帮您找回。' }}
            </p>
        </template>
        <template v-else-if="!showError && showRight">
            <div
                class="mm-box mm-box--display-flex mm-box--flex-direction-row mm-box--justify-content-center mm-box--align-items-center">
                <span
                    class="mm-box mm-icon mm-icon--size-xl mm-box--display-inline-block mm-box--text-align-center mm-box--width-1/12 mm-box--color-success-default"
                    style="mask-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj4KICA8cGF0aCBkPSJtMjU2IDQzYy0xMTggMC0yMTMgOTUtMjEzIDIxMyAwIDExOCA5NSAyMTMgMjEzIDIxMyAxMTggMCAyMTMtOTUgMjEzLTIxMyAwLTExOC05NS0yMTMtMjEzLTIxM3ogbTEwMiAxNjRsLTEyMSAxMjFjLTMgMy03IDUtMTEgNS01IDAtOS0yLTEyLTVsLTYwLTYwYy02LTctNi0xNyAwLTIzIDYtNiAxNi02IDIzIDBsNDkgNDkgMTA5LTExMGM3LTYgMTctNiAyMyAwIDYgNyA2IDE3IDAgMjN6Ii8+Cjwvc3ZnPgo=);"></span>
            </div>
            <p class="mm-box mm-text mm-text--body-lg-medium mm-text--text-align-center mm-box--color-success-default">
                答对了！没有人能够帮您找回您的私钥助记词</p>
            <p class="mm-box mm-text mm-text--body-md mm-text--text-align-center mm-box--color-text-default">
                {{ step === 2 ? '任何声称需要您的私钥助记词的人都在对您进行欺诈。如果您与他们分享私钥助记词，他们就会偷窃您的资产。' :
                    '将它写下来、刻在金属上，或保存在多个秘密位置，这样您就不会丢失。如果丢失了，它就会永远消失。' }}
            </p>
        </template>
        <button v-if="!step" @click="onStart"
            class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-primary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-inverse mm-box--background-color-primary-default mm-box--rounded-pill"
            data-theme="light" data-testid="srp-quiz-get-started">开始</button>
        <button v-if="showError" @click="() => {
            this.showError = false
        }" class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-primary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-inverse mm-box--background-color-primary-default mm-box--rounded-pill"
            data-theme="light" data-testid="srp-quiz-get-started">重试</button>
        <button v-if="showRight" @click="() => {
            this.showRight = false;
            if (this.step === 2) {
                this.$router.push({
                    path: '/display-private-key-mnemonics'
                })
            } else {
                this.step += 1;
            }
        }" class="mm-box mm-text mm-button-base mm-button-base--size-lg mm-button-primary mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-4 mm-box--padding-left-4 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-inverse mm-box--background-color-primary-default mm-box--rounded-pill"
            data-theme="light" data-testid="srp-quiz-get-started">继续</button>
        <button
            class="mm-box mm-text mm-button-base mm-button-link mm-button-link--size-auto mm-text--body-md-medium mm-box--padding-0 mm-box--padding-right-0 mm-box--padding-left-0 mm-box--display-inline-flex mm-box--justify-content-center mm-box--align-items-center mm-box--width-full mm-box--color-primary-default mm-box--background-color-transparent"
            data-testid="srp-quiz-learn-more">了解更多</button>
    </Dialog>
</template>
<script>
import Img from '@/static/img/reveal-srp.png';
import Dialog from '@/components/common/Dialog.vue'
export default {
    name: "DisplayPrivateKeyMnemonicsDialog",
    components: {
        Dialog
    },
    props: {
    },
    data() {
        return {
            Img,
            step: 0,
            totalStep: 2,
            rightAswners: [2, 1],
            showError: false,
            showRight: false
        }
    },
    methods: {
        onChooseAnswer(idx) {
            console.log(idx)
            if (this.rightAswners[this.step - 1] === idx) {
                this.showRight = true;
            } else {
                this.showError = true;
            }
        },
        onStart() {
            this.step = 1;
        },
        onClose() {
            this.$emit('onClose');
        }
    }
}
</script>
<style lang="css" scoped>
.mm-button-secondary:hover:not(.mm-button-secondary--disabled) {
    background-color: #fff;
    color: var(--color-primary-default);
}
</style>