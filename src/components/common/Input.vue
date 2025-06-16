<template>
    <div :class="{
        'MuiInputBase-root MuiInput-root jss12 MuiInputBase-fullWidth MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl MuiInputBase-adornedStart MuiInputBase-adornedEnd': true,
        'sm-wrapper': size === 'sm'
    }">
        <!-- <div class="MuiInputAdornment-root MuiInputAdornment-positionStart" style="margin-right: 12px;">
            <span class="mm-box mm-icon mm-icon--size-sm mm-box--display-inline-block mm-box--color-icon-muted"
                style="mask-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj4KICA8cGF0aCBkPSJtNDUwIDQ2OWMtNSAwLTEwLTItMTQtNWwtMzgtMzljLTQtNC02LTktNi0xNCAwLTUgMi0xMCA2LTEzIDMtNCA4LTYgMTMtNiA1IDAgMTAgMiAxNCA2bDM5IDM4YzMgNCA1IDkgNSAxNCAwIDUtMiAxMC01IDE0LTQgMy05IDUtMTQgNXogbS0yMDQtMTljLTExMiAwLTIwMy05MS0yMDMtMjA0IDAtMTEyIDkxLTIwMyAyMDMtMjAzIDExMyAwIDIwNCA5MSAyMDQgMjAzIDAgMTEzLTkxIDIwNC0yMDQgMjA0eiBtMC0zNjljLTQzIDAtODUgMTgtMTE2IDQ5LTMxIDMxLTQ5IDczLTQ5IDExNiAwIDQ0IDE4IDg2IDQ5IDExNyAzMSAzMSA3MyA0OCAxMTYgNDggNDQgMCA4Ni0xNyAxMTctNDggMzEtMzEgNDgtNzMgNDgtMTE3IDAtNDMtMTctODUtNDgtMTE2LTMxLTMxLTczLTQ5LTExNy00OXoiLz4KPC9zdmc+Cg==);">
            </span>
        </div> -->
        <input :value="value" :name="name" aria-invalid="false" autocomplete="off" id="search-settings"
            :placeholder="placeholder" :type="type" dir="auto" @input="onValueChange"
            class="MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedStart MuiInputBase-inputAdornedEnd"
            value="">
    </div>
</template>
<script>
export default {
    name: 'MInput',
    props: {
        value: {
            type: [String, Number, Boolean],
        },
        placeholder: {
            type: String,
            default: '搜索'
        },
        name: {
            type: String,
            required: false
        },
        type: {
            type: String,
            default: 'text'
        },
        size: {
            type: String,
            default: 'lg'
        }
    },
    methods: {
        onValueChange(e) {
            this.$emit('input', e.target.value);
        }
    }
}
</script>
<style lang="css" scoped>
.jss12 {
    color: var(--color-text-default);
    border: 2px solid var(--color-border-muted);
    height: 48px;
    display: flex;
    padding: 0 12px;
    font-size: 0.875rem;
    align-items: center;
    font-family: "CentraNo1", Helvetica, Arial, sans-serif;
    border-radius: 8px;
    background-color: var(--color-background-default);
}

.sm-wrapper {
    height: 36px;
}

.MuiInput-root {
    position: relative;
}

.MuiInputBase-fullWidth {
    width: 100%;
}

.MuiInputBase-root {
    color: rgba(0, 0, 0, 0.87);
    cursor: text;
    display: inline-flex;
    position: relative;
    font-size: 1rem;
    box-sizing: border-box;
    align-items: center;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.1876em;
    letter-spacing: 0.00938em;
}

.MuiInputAdornment-positionStart {
    margin-right: 8px;
}

.MuiInputAdornment-root {
    height: 0.01em;
    display: flex;
    max-height: 2em;
    align-items: center;
    white-space: nowrap;
}

.MuiInputBase-input {
    font: inherit;
    color: currentColor;
    width: 100%;
    border: 0;
    height: 1.1876em;
    margin: 0;
    display: block;
    padding: 6px 0 6px;
    min-width: 0;
    background: none;
    box-sizing: content-box;
    animation-name: mui-auto-fill-cancel;
    letter-spacing: inherit;
    animation-duration: 10ms;
    -webkit-tap-highlight-color: transparent;
    caret-color: var(--brand-colors-green-green900);
}

.MuiInputBase-input::placeholder {
    color: var(--color-text-muted);
    font-size: 14px;
}

.MuiInput-input,
.MuiInputBase-input {
    color: var(--color-text-default) !important;
}
</style>