<template>
    <v-data-table
        :dense="dense"
        :show-select="showSelect"
        :item-key="itemKey"
        :headers="headers"
        :items="items"
        :server-items-length="totalRows"
        :page="options.page"
        :items-per-page="options.itemsPerPage"
        :sort-by="options.sortBy"
        :sort-desc="options.sortDesc"
        :multi-sort="options.multiSort"
        :must-sort="options.mustSort"
        @update:options="options = $event;"
        :loading="loading"
        :disable-sort="disabled"
        mobile-breakpoint="0"
        hide-default-header
        hide-default-footer
        :fixed-header="fixedHeader"
        :class="contentClass"
        :height="height"
    >
        <template v-slot:top>
            <v-row class="my-1" :dense="dense" v-if="!countHide || !customHide || !customHide2 || !addHide || !downloadHide || !itemsPerPageHide || !removeHide">
                <v-col cols="12" class="d-flex justify-start align-end">
                    <template v-if="!itemsPerPageHide">
                        <div style="width: 150px;" class="ml-auto">
                        <v-select
                            dense
                            outlined
                            hide-details="auto"
                            :value="options.itemsPerPage"
                            :items="paginationList"
                            @change="options.itemsPerPage = $event; options.page = 1;"
                            >
                        </v-select>
                    </div>
                    </template>
                </v-col>
                <v-col cols="12" class="d-flex justify-start align-end">
                    <template v-if="!countHide">
                        <div style="width: 200px;">
                            <h3 class="text-left">{{count}}</h3>
                        </div>
                    </template>
                    <template v-if="!customHide2">
                        <v-btn elevation="1" class="btn-blue ml-auto" color="view" style="color: #000;" @click="customFunction2">{{customButtonTxt2 !== undefined && customButtonTxt2 != null ? customButtonTxt2 : ""}}</v-btn>
                    </template>
                    <template v-if="!customHide">
                        <v-btn elevation="1" :class="`btn-blue ${customHide2 ? 'ml-auto' : 'ml-1'}`" color="view" style="color: #000;" @click="customFunction">{{customButtonTxt !== undefined && customButtonTxt != null ? customButtonTxt : ""}}</v-btn>
                    </template>
                </v-col>
            </v-row>
            <div class="mx-1 mb-1">
                <slot name="top-body"></slot>
            </div>
        </template>
        <template v-slot:header="headerSlot">
            <thead class="v-data-table-header">
                <template v-if="maxRow === 1">
                    <tr>
                        <template v-if="showSelect">
                                <th scope="col" class="text-start" style="width: 1px; min-width: 1px;">
                                    <template v-if="multipleSelect">
                                        <v-checkbox
                                            v-model="checkAll"
                                            @change="checkAllClick($event, headerSlot.on['toggle-select-all'])"
                                            :disabled="items.length === 0"
                                            :indeterminate="indeterminate"
                                            class="radio--margin-none"
                                            hide-details
                                            color="normal"
                                            style="margin: auto !important; max-width: fit-content;"
                                        />
                                    </template>
                                    <template v-else>
                                    </template>
                                </th>
                        </template>
                        <template v-for="(header, headerKey) in headers">
                            <th
                                :key="headerKey"
                                v-if="($vuetify.breakpoint.mdAndDown ? !header.isNotMobile : true)"
                                @click="header.sortable && items.length > 0 && !loading ? headerSlot.on.sort(header.value) : null"
                                scope="col"
                                :colspan="header.colspan"
                                :rowspan="header.rowspan"
                                :class="(header.sortable && items.length > 0  ? 'sortable' : '') + (headerSlot.props.options.sortBy.indexOf(header.value) !== -1 ? ' active' : '') + (header.align ? ` text-${header.align}`: `text-center`)"
                                :style="header.width ? (isNaN(Number(header.width)) ? ('width: ' + header.width + '; min-width: ' + header.width +';'): ('width: ' + header.width + 'px; min-width: ' + header.width + 'px;')) : ''"
                            >
                                <span>{{header.text}}</span>
                                <template v-if="header.sortable&& items.length > 0">
                                    <v-icon
                                        size="18"
                                        class="v-data-table-header__icon"
                                    >
                                        <template v-if="headerSlot.props.options.sortDesc[headerSlot.props.options.sortBy.indexOf(header.value)]">
                                            mdi-arrow-down
                                        </template>
                                        <template v-else>
                                            mdi-arrow-up
                                        </template>
                                    </v-icon>
                                </template>
                            </th>
                        </template>
                    </tr>
                </template>
                <template v-else>
                    <template v-for="(row, rowkey) in maxRow">
                        <tr :key="rowkey">
                            <template v-if="showSelect && row === 1">
                                <th :rowspan="maxRow" scope="col" class="text-start" style="width: 1px; min-width: 1px;">
                                    <template v-if="multipleSelect">
                                        <v-checkbox
                                            v-model="checkAll"
                                            @change="checkAllClick($event, headerSlot.on['toggle-select-all'])"
                                            :disabled="items.length === 0"
                                            :indeterminate="indeterminate"
                                            class="radio--margin-none"
                                            hide-details
                                            color="normal"
                                            style="margin: auto !important; max-width: fit-content;"
                                        />
                                    </template>
                                </th>
                            </template>
                            <template v-for="(header, headerKey) in headers">
                                <template v-if="row === header.row">
                                    <th
                                        :key="headerKey"
                                        v-if="($vuetify.breakpoint.mdAndDown ? !header.isNotMobile : true)"
                                        @click="header.sortable && items.length > 0 ? headerSlot.on.sort(header.value) : null"
                                        scope="col"
                                        :colspan="header.colspan"
                                        :rowspan="header.rowspan"
                                        :class="(header.sortable && items.length > 0  ? 'sortable' : '') + (headerSlot.props.options.sortBy.indexOf(header.value) !== -1 ? ' active' : '')"
                                        :style="header.width ? (isNaN(Number(header.width)) ? ('width: ' + header.width + '; min-width: ' + header.width +';'): ('width: ' + header.width + 'px; min-width: ' + header.width + 'px;')) : ''"
                                    >
                                        <span>{{header.text}}</span>
                                        <template v-if="header.sortable&& items.length > 0">
                                            <v-icon
                                                size="18"
                                                class="v-data-table-header__icon"
                                            >
                                                <template v-if="headerSlot.props.options.sortDesc[headerSlot.props.options.sortBy.indexOf(header.value)] === 'true' || headerSlot.props.options.sortDesc[headerSlot.props.options.sortBy.indexOf(header.value)] === true">
                                                    mdi-arrow-down
                                                </template>
                                                <template v-else>
                                                    mdi-arrow-up
                                                </template>
                                            </v-icon>
                                        </template>
                                    </th>
                                </template>
                            </template>
                        </tr>
                    </template>
                </template>
            </thead>
        </template>
        <template v-if="items.length !== 0" v-slot:body="props">
            <tbody
                :key="dataTableRepaint">
                <tr :style="((clicked && clickedItem === item[itemKey]) ? 'background-color: #e0e0e0; color: black ' : '')" :class="getClass(rowClassConditional, item)" v-for="item in props.items" :key="item[itemKey]" @click="clickRow(item)">
                    <td v-if="showSelect">
                        <template v-if="isTrue(checkboxConditional, item)">
                            <template v-if="multipleSelect">
                                <v-checkbox
                                    v-model="data"
                                    :value="item"
                                    multiple
                                    class="radio--margin-none"
                                    hide-details
                                    style="margin: auto !important; max-width: fit-content;"
                                />
                            </template>
                            <template v-else>
                                <v-radio-group v-model="rediaoData">
                                    <v-radio
                                    class="radio--margin-none"
                                    hide-details
                                    :value="item"/>
                                </v-radio-group>
                            </template>
                        </template>
                    </td>
                    <template v-for="(header, headerKey) in headers">
                        <td v-if="!header.colspan && ($vuetify.breakpoint.mdAndDown ? !header.isNotMobile : true)" :class="header.cellClass" :key="headerKey">
                            <template v-if="header.prependText !== undefined && header.prependText !== null && header.prependText !== ''">
                                <span>{{header.prependText}}</span>
                            </template>
                            <template v-if="header.type === 'icon'">
                                <v-icon
                                    class="mr-2"
                                    @click.stop="clickIcon(item, header.value)"
                                >{{cell[header.type][header.value].title}}</v-icon>
                            </template>
                            <template v-else-if="header.type === 'autocomplete'">
                                <v-autocomplete
                                    v-model="item[header.value]"
                                    dense
                                    outlined
                                    hide-details
                                    :items="cell[header.type][header.value].items"
                                    @click.stop
                                    @change="changeAutocomplete($event, header.value, item)"
                                ></v-autocomplete>
                            </template>
                            <template v-else-if="header.type === 'button'">
                                <v-btn
                                    v-if="isTrue(cell[header.type][header.value].conditional, item)"
                                    hide-details
                                    :x-small="cell[header.type][header.value].xsmall"
                                    :small="cell[header.type][header.value].small"
                                    :x-large="cell[header.type][header.value].xlarge"
                                    :large="cell[header.type][header.value].large"
                                    :class="cell[header.type][header.value].contentClass"
                                    @click.native.stop="clickButton(item, header.value)"
                                >{{item[header.value] ? item[header.value] : cell[header.type][header.value].title}}</v-btn>
                            </template>
                            <template v-else-if="header.type === 'textField'">
                                <v-text-field
                                    v-model="item[header.value]"
                                    hide-details
                                    @click.stop
                                    @input="inputTextField($event, item, header.value)"
                                    dense
                                    outlined
                                ></v-text-field>
                            </template>
                            <template v-else-if="header.type === 'textFieldMulti'">
                                <v-row dense v-if="item.type != 0" class="ma-0" justify="center">
                                    <v-col cols="5">
                                        <v-text-field
                                            v-model="item[header.value][0]"
                                            hide-details
                                            @click.stop
                                            @input="inputTextFieldMulti($event, item, header.value)"
                                            dense
                                            outlined
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="auto" style="margin-top: 4%;">
                                    ~
                                    </v-col>
                                    <v-col cols="5">
                                        <v-text-field
                                            v-model="item[header.value][1]"
                                            hide-details
                                            @click.stop
                                            @input="inputTextFieldMulti($event, item, header.value)"
                                            dense
                                            outlined
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row dense v-if="item.type == 0" class="ma-0" justify="center">
                                    <v-col cols="12">
                                        <v-btn
                                            elevation-0
                                            :color="cell[header.type][header.value].color"
                                            :style="cell[header.type][header.value].style"
                                            @click.stop="inputTextFieldMulti($event, item, header.value, 'detail')"
                                        >상세 변경</v-btn>
                                    </v-col>
                                </v-row>
                                <!-- <v-row v-if="item.type == 0" style="margin: 0px;justify-content: end;">
                                    <v-col cols="auto" style="margin-top: 4%;">
                                        4G :
                                    </v-col>
                                    <v-col cols="5">
                                        <v-text-field
                                            v-model="item[header.value][2]"
                                            hide-details
                                            @click.stop
                                            @input="inputTextField($event, item, header.value)"
                                            dense
                                            outlined
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row v-if="item.type == 0" style="margin: 0px;justify-content: end;">
                                    <v-col cols="auto" style="margin-top: 4%;">
                                        8G :
                                    </v-col>
                                    <v-col cols="5">
                                        <v-text-field
                                            v-model="item[header.value][3]"
                                            hide-details
                                            @click.stop
                                            @input="inputTextField($event, item, header.value)"
                                            dense
                                            outlined
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row v-if="item.type == 0" style="margin: 0px;justify-content: end;">
                                    <v-col cols="auto" style="margin-top: 4%;">
                                        16G :
                                    </v-col>
                                    <v-col cols="5">
                                        <v-text-field
                                            v-model="item[header.value][4]"
                                            hide-details
                                            @click.stop
                                            @input="inputTextField($event, item, header.value)"
                                            dense
                                            outlined
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row v-if="item.type == 0" style="margin: 0px;justify-content: end;">
                                    <v-col cols="auto" style="margin-top: 4%;">
                                        32G :
                                    </v-col>
                                    <v-col cols="5">
                                        <v-text-field
                                            v-model="item[header.value][5]"
                                            hide-details
                                            @click.stop
                                            @input="inputTextField($event, item, header.value)"
                                            dense
                                            outlined
                                        ></v-text-field>
                                    </v-col>
                                </v-row> -->
                            </template>
                            <template v-else-if="header.type === 'radio'">
                                <v-radio-group
                                    row
                                    dense
                                    column
                                    v-model="item[header.value]"
                                    @change="inputTextField($event, item, header.value)"
                                >
                                    <v-radio dense label="사용" :value="24"></v-radio>
                                    <v-radio dense label="미사용" :value="25"></v-radio>
                                </v-radio-group>
                            </template>
                            <template v-else-if="header.type === 'img'">
                                <v-img
                                    v-if="item[header.value] !== undefined && item[header.value] !== null && item[header.value] !== ''"
                                    :src="cell[header.type][header.value].src"
                                    :alt="cell[header.type][header.value].alt"
                                    :width="cell[header.type][header.value].width"
                                    :height="cell[header.type][header.value].height"
                                    :class="cell[header.type][header.value].contentClass"
                                    @click.stop="clickImg(item, header.value)"
                                ></v-img>
                            </template>
                            <template v-else-if="header.type === 'multiButton'">
                                <template v-for="(button, btnIndex) in cell[header.type][header.value].buttonList">
                                    <v-btn
                                        :key="btnIndex"
                                        x-small
                                        v-if="isTrue(button.conditional, item)"
                                        :color="button.color"
                                        :style="button.style"
                                        :class="button.contentClass"
                                        :disabled="button.disabled"
                                        @click.stop="clickMultiButton(item, header.value, button.title)"
                                    >{{button.title}}</v-btn>
                                </template>
                            </template>
                            <template v-else-if="header.type === 'textOrMultiButton'">
                                <template v-if="isTrue(cell[header.type][header.value].conditional, item)">
                                    <span>{{item[header.value]}}</span>
                                </template>
                                <template v-else>
                                    <template v-for="(button, btnIndex) in cell[header.type][header.value].buttonList">
                                        <v-btn
                                            :key="btnIndex"
                                            x-small
                                            v-if="isTrue(button.conditional, item)"
                                            :color="button.color"
                                            :class="button.contentClass"
                                            @click.stop="clickMultiButton(item, header.value, button.title)"
                                        >{{button.title}}</v-btn>
                                    </template>
                                </template>
                            </template>
                            <template v-else-if="header.type === 'htmlAndMultiButton'">
                                <div @click.stop="clickHtml(item, header.value)" v-html="item[header.value]"></div>
                                <template v-for="(button, btnIndex) in cell[header.type][header.value].buttonList">
                                    <v-btn
                                        :key="btnIndex"
                                        x-small
                                        v-if="isTrue(button.conditional, item)"
                                        :color="button.color"
                                        :class="button.contentClass"
                                        @click.stop="clickMultiButton(item, header.value, button.title)"
                                    >{{button.title}}</v-btn>
                                </template>
                            </template>
                            <template v-else-if="header.type === 'html'">
                                <div @click.stop="clickHtml(item, header.value)" v-html="item[header.value]"></div>
                            </template>
                            <template v-else-if="header.type === 'checkBoxActiveAboutMultiButton'">
                                <v-checkbox
                                    v-if="cell[header.type][header.value].buttonList !== undefined && cell[header.type][header.value].buttonList != null &&
                                    cell[header.type][header.value].buttonList.filter(e => isTrue(e.conditional, item)).length > 0
                                    "
                                    v-model="item[`isActiveMultiButton${headerKey}`]"
                                    class="radio--margin-none"
                                    hide-details
                                    style="margin: auto !important; max-width: fit-content;"
                                />
                                <v-tooltip
                                    v-else
                                    bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                            color="primary"
                                            dark
                                            small
                                            v-bind="attrs"
                                            v-on="on"
                                        >
                                        mdi-help
                                        </v-icon>
                                    </template>
                                    <span>{{item[header.value]}}</span>
                                </v-tooltip>
                                <template v-for="(button, bKey) in cell[header.type][header.value].buttonList">
                                    <v-btn
                                        :key="bKey"
                                        :disabled="item[`isActiveMultiButton${headerKey}`] === undefined || item[`isActiveMultiButton${headerKey}`] == null || !item[`isActiveMultiButton${headerKey}`]"
                                        x-small
                                        v-if="isTrue(button.conditional, item)"
                                        :color="button.color"
                                        :class="button.contentClass"
                                        @click.stop="clickMultiButton(item, header.value, button.title)"
                                    >{{button.title}}</v-btn>
                                </template>
                            </template>
                            <template v-else-if="header.type === 'checkBoxByValue'">
                                <v-checkbox
                                    readonly
                                    v-model="item[header.value]"
                                    class="radio--margin-none"
                                    true-value="T"
                                    false-value="F"
                                    hide-details
                                    style="margin: auto !important; max-width: fit-content;"
                                    @click.native.stop="clickButton(item, header.value)"
                                />
                            </template>
                            <template v-else-if="header.type === 'htmlAndMultiImage'">
                                <div :class="cell[header.type][header.value].contentClass">
                                    <div @click.stop="clickHtml(item, header.value)" v-html="item[header.value]"></div>
                                    <template v-for="(img, imgIndex) in cell[header.type][header.value].imgList">
                                        <v-img
                                            :key="imgIndex"
                                            v-if="isTrue(img.conditional, item)"
                                            :src="img.src"
                                            :alt="img.alt"
                                            :width="img.width"
                                            :height="img.height"
                                            @click.native.stop="clickImg(item, header.value)"
                                        ></v-img>
                                    </template>
                                </div>
                            </template>
                            <template v-else-if="header.type === 'textImage'">
                                <v-row :class="cell[header.type][header.value].contentClass">
                                    <v-col cols="auto" class="pr-0">
                                        {{item[header.value]}}
                                    </v-col>
                                    <v-col class="pl-0">
                                        <v-img
                                            v-if="isTrue(cell[header.type][header.value].conditional, item)"
                                            :src="cell[header.type][header.value].src"
                                            :alt="cell[header.type][header.value].alt"
                                            :width="cell[header.type][header.value].width"
                                            :height="cell[header.type][header.value].height"
                                            @click.native.stop="clickImg(item, header.value)"
                                        ></v-img>
                                    </v-col>
                                </v-row>
                            </template>
                            <template v-else-if="header.type === 'styleText'">
                                <span
                                    :class="getClass(cell[header.type][header.value].conditional, item)"
                                    @click.stop="clickStyleText(item, header.value)"
                                >{{item[header.value]}}</span>
                            </template>
                            <template v-else-if="header.type === 'currency'">
                                <span>{{numeral(item[header.value]).format("0,0")}}</span>
                            </template>
                            <template v-else-if="header.type === 'tooltip'">
                                <v-tooltip top>
                                    <template v-slot:activator="act">
                                        <span v-on="act.on" v-bind="act.attrs">
                                            {{item[header.value]}}
                                        </span>
                                    </template>
                                    <template v-if="item[header.value] !== undefined && item[header.value] !== null && item[header.value].length > 100">
                                        <template v-for="i in Math.ceil(item[header.value].length / 80)">
                                            <template v-if="i === Math.ceil(item[header.value].length / 80)">
                                                {{item[header.value].substring((i -1) * 80)}}
                                            </template>
                                            <template v-else>
                                                {{item[header.value].substring((i -1) * 80, i * 80)}} <br :key="i"/>
                                            </template>
                                        </template>
                                    </template>
                                    <template v-else>
                                        {{item[header.value]}}
                                    </template>
                                </v-tooltip>
                            </template>
                            <template v-else-if="header.type === 'tooltipDetail'">
                                <v-tooltip top>
                                    <template v-slot:activator="act">
                                        <span v-on="act.on" v-bind="act.attrs">
                                            {{item[header.value]}}
                                        </span>
                                    </template>
                                    <template v-if="item[header.value] !== undefined && item[header.value] !== null && item[header.value].length > 100">
                                        <template v-for="i in Math.ceil(item[header.value].length / 80)">
                                            <template v-if="i === Math.ceil(item[header.value].length / 80)">
                                                {{item[header.value].substring((i -1) * 80)}}
                                            </template>
                                            <template v-else>
                                                {{item[header.value].substring((i -1) * 80, i * 80)}} <br :key="i"/>
                                            </template>
                                        </template>
                                    </template>
                                    <template v-else>
                                        {{item.tooltipDescription}}
                                    </template>
                                </v-tooltip>
                            </template>
                            <template v-else>
                                <span>{{item[header.value]}}</span>
                            </template>
                            <template v-if="header.appendText !== undefined && header.appendText !== null && header.appendText !== ''">
                                <span>{{header.appendText}}</span>
                            </template>
                        </td>
                    </template>
                </tr>
            </tbody>
        </template>
        <template v-else v-slot:body>
            <tbody>
                <tr>
                    <td v-if="loading" :colspan="headers.length + (showSelect ? 1 : 0)" class="text-center">
                        <h4 style="opacity: 0.4;">데이터 가져오는 중...</h4>
                    </td>
                    <td v-else :colspan="headers.length + (showSelect ? 1 : 0)" class="text-center">
                        <div class="py-3">
                            <v-icon size="200" style="opacity: 0.12;">
                                mdi-database-remove-outline
                            </v-icon>
                            <br>
                            <h4 style="opacity: 0.4;">데이터가 없습니다.</h4>
                        </div>
                    </td>
                </tr>
            </tbody>
        </template>
        <template v-slot:footer>
            <v-row dense>
                <v-col cols="12" class="pa-0" v-if="!bottomPageButtonHide">
                    <div class="text-center my-4" >
                        <v-pagination
                            color="#0277BD"
                            class="d-inline-block"
                            :length="Math.ceil(totalRows / options.itemsPerPage)"
                            :total-visible="10"
                            v-model="options.page"
                            :disabled="disabled"
                        ></v-pagination>
                    </div>
                </v-col>
            </v-row>
        </template>
    </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
// import meta from '@/api/meta';
// import CudBtnComponent from '@/pages/components/CUDBtn.vue';

export default Vue.component('data-table-custom-component', {
    components: {
        // CudBtnComponent,
    },
    props: {
        headers: {
            type: Array,
            default: () => [
                {
                    text: 'template1', sortable: true, value: 'template1', align: 'center', width: '100', cellClass: 'w-10',
                },
                {
                    text: 'template2', sortable: true, value: 'template2', align: 'center', width: '100', cellClass: 'w-10',
                },
                {
                    text: 'template3', sortable: true, value: 'template3', align: 'center', width: '100', cellClass: 'w-10',
                },
                {
                    text: 'template4', sortable: true, value: 'template4', align: 'center', width: '100', cellClass: 'w-10',
                },
                {
                    text: 'template5', sortable: true, value: 'template5', align: 'center', width: '100', cellClass: 'text-truncate w-10',
                },
            ],
        },
        items: {
            type: Array,
            default: () => [],
        },
        itemClass: {
            type: String,
            default: '',
        },
        totalRows: {
            type: Number,
            default: 0,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        uploadHide: {
            type: Boolean,
            default: false,
        },
        customHide: {
            type: Boolean,
            default: true,
        },
        customButtonTxt: {
            type: String,
            default: '',
        },
        customHide2: {
            type: Boolean,
            default: true,
        },
        customButtonTxt2: {
            type: String,
            default: '',
        },
        addHide: {
            type: Boolean,
            default: false,
        },
        removeHide: {
            type: Boolean,
            default: false,
        },
        showSelect: {
            type: Boolean,
            default: false,
        },
        multipleSelect: {
            type: Boolean,
            default: true,
        },
        itemKey: {
            type: String,
            default: 'id',
        },
        countTitle: {
            type: Object,
            default: () => ({
                front: '전체',
                end: '건',
            }),
        },
        cell: {
            type: Object,
            default: () => ({}),
        },
        downloadHide: {
            type: Boolean,
            default: false,
        },
        bottomPageButtonHide: {
            type: Boolean,
            default: false,
        },
        search: {
            type: Boolean,
            default: false,
        },
        page: {
            type: Number,
            default: 1,
        },
        dataTableRepaint: {
            type: Number,
            default: 1,
        },
        itemsPerPage: {
            type: Number,
            default: 10,
        },
        dense: {
            type: Boolean,
            default: false,
        },
        contentClass: {
            type: String,
            default: 'tableline',
        },
        rowClassConditional: {
            type: [Object, Array],
            default: null,
        },
        sortBy: {
            type: Array,
            default: () => [],
        },
        sortDesc: {
            type: Array,
            default: () => [],
        },
        groupBy: {
            type: Array,
            default: () => [],
        },
        groupDesc: {
            type: Array,
            default: () => [],
        },
        multiSort: {
            type: Boolean,
            default: false,
        },
        mustSort: {
            type: Boolean,
            default: false,
        },
        itemsPerPageHide: {
            type: Boolean,
            default: false,
        },
        countHide: {
            type: Boolean,
            default: false,
        },
        maxRow: {
            type: Number,
            default: 1,
        },
        checkboxConditional: {
            type: Object,
            default: null,
        },
        dataProps: {
            type: Array,
            default: () => [],
        },
        radioProps: {
            type: Object,
            default: null,
        },
        fixedHeader: {
            type: Boolean,
            default: false,
        },
        height: {
            type: [String, Number],
            default: undefined,
        },
        clicked: {
            type: Boolean,
            default: false,
        },
        clickedItemProp: {
            type: [String, Number],
            default: null,
        },
    },
    data() {
        return {
            paginationList: [
                { text: '5개 보기', value: 5 },
                { text: '10개 보기', value: 10 },
                { text: '20개 보기', value: 20 },
                { text: '30개 보기', value: 30 },
                { text: '50개 보기', value: 50 },
                { text: '100개 보기', value: 100 },
                { text: '500개 보기', value: 500 },
            ],
            options: {
                page: 1,
                itemsPerPage: 10,
                sortBy: [],
                sortDesc: [],
                groupBy: [],
                groupDesc: [],
                multiSort: false,
                mustSort: false,
            },
            data: [],
            rediaoData: null,
            checkAll: false,
            indeterminate: false,
            checkTotal: null,
            clickedItem: null,
            cellData: this.cell,
        };
    },
    watch: {
        headers: {
            handler(n) {
                console.log(n);
            },
            deep:true,
        },
        "options.page": {
            handler(n) {
                this.$emit('tablePage', this.options.page);
            },
            deep:true,
        },
        // cell: {
        //     han
        // },
        dataProps: {
            handler(n) {
                this.$nextTick(() => {
                    this.data = n;
                });
            },
            deep: true,
        },
        clickedItemProp: {
            handler(n) {
                if (n) {
                    this.$nextTick(() => {
                        this.clickedItem = n;
                    });
                }
            },
        },
        radioProps: {
            handler(n) {
                this.rediaoData = n;
            },
            deep: true,
        },
        options: {
            handler(n) {
                this.$emit('reload', n);
            },
            deep: true,
        },
        search: {
            handler(n) {
                if (n) {
                    if (this.options.page !== 1) {
                        this.options.page = 1;
                    } else {
                        this.$emit('reload', this.options);
                    }
                }
            },
        },
        data: {
            handler(n) {
                let item = [];
                if (this.items.length === 0) {
                    this.checkAll = false;
                    this.indeterminate = false;
                } else {
                    if (this.checkboxConditional !== null) {
                        n.forEach((e) => {
                            if (this.isTrue(this.checkboxConditional, e)) {
                                item.push(e);
                            }
                        });
                    } else {
                        item = n;
                    }
                    this.$emit('selected', item);
                    if (item.length === this.checkTotal) {
                        this.checkAll = true;
                        this.indeterminate = false;
                    } else if (item.length === 0) {
                        this.checkAll = false;
                        this.indeterminate = false;
                    } else {
                        this.checkAll = false;
                        this.indeterminate = true;
                    }
                }

                this.clickedItem = null;
            },
            deep: true,
        },
        rediaoData: {
            handler(n) {
                let item = null;
                if (this.items.length === 0) {
                    this.indeterminate = false;
                } else {
                    if (this.checkboxConditional !== null) {
                        if (this.isTrue(this.checkboxConditional, n)) {
                            item = n;
                        }
                    } else {
                        item = n;
                    }
                    this.$emit('selected', item);
                    if (n !== undefined && n != null) {
                        this.indeterminate = false;
                    } else {
                        this.indeterminate = true;
                    }
                }
            },
            deep: true,
        },
        items: {
            handler(n) {
                this.data = [];
                if (this.checkboxConditional !== null) {
                    let c = 0;
                    n.forEach((e) => {
                        if (this.isTrue(this.checkboxConditional, e)) {
                            c += 1;
                        }
                    });
                    this.checkTotal = c;
                } else {
                    this.checkTotal = n.length;
                }
                this.$emit('update:data-table-repaint', this.dataTableRepaint + 1);
            },
            deep: true,
        },
    },
    computed: {
        disabled() {
            return !!(this.loading || this.totalRows === 0);
        },
        count() {
            let finalCount = null; let
                temp;
            let alterCount = this.totalRows;
            while (alterCount > 1000) {
                temp = alterCount % 1000;
                alterCount = Math.floor(alterCount / 1000);
                finalCount = `,${String(temp)}`;
            }
            if (finalCount != null) finalCount = String(alterCount) + finalCount;
            else finalCount = this.totalRows;
            return `${this.countTitle.front} ${finalCount}${this.countTitle.end}`;
        },
    },
    methods: {
        clickRow(e) {
            this.$emit('click:row', e);
            this.clickedItem = e[this.itemKey];
        },
        excelUpload() {
            this.$emit('upload');
        },
        remove() {
            if (this.data.length === 0) {
                // meta.alert('삭제할 항목을 선택해주세요.');
                return;
            }
            this.$emit('remove', this.data);
        },
        add() {
            this.$emit('add');
        },
        clickIcon(item, header) {
            const clicked = { item, header };
            this.$emit('click:icon', clicked);
        },
        changeAutocomplete(id, header, item) {
            const selected = { id, header, item };
            this.$emit('change:autocomplete', selected);
        },
        clickButton(item, header) {
            const clicked = { item, header };
            this.$emit('click:button', clicked);
        },
        inputTextField(value, item, header) {
            const clicked = { value, item, header };
            this.$emit('input:textField', clicked);
        },
        inputTextFieldMulti(value, item, header, idx = null) {
            const clicked = {
                value, item, header, idx,
            };
            this.$emit('input:textField', clicked);
        },
        inputClickAfterTextField(value, item, header) {
            const clicked = { value, item, header };
            this.$emit('input:clickAfterTextField', clicked);
        },
        download() {
            this.$emit('download');
        },
        customFunction() {
            this.$emit('customFunction');
        },
        customFunction2() {
            this.$emit('customFunction2');
        },
        clickImg(item, header) {
            const clicked = { item, header };
            this.$emit('click:img', clicked);
        },
        clickMultiButton(item, header, title) {
            const clicked = { item, header, title };
            this.$emit('click:multiButton', clicked);
        },
        isTrue(conditional, item) {
            if (conditional !== undefined && conditional !== null) {
                if (conditional[0] === undefined) {
                    switch (conditional.inequality) {
                    case 'gt':
                        return item[conditional.column] > conditional.target;
                    case 'ge':
                        return item[conditional.column] >= conditional.target;
                    case 'lt':
                        return item[conditional.column] < conditional.target;
                    case 'le':
                        return item[conditional.column] <= conditional.target;
                    case 'eq':
                        return item[conditional.column] === conditional.target;
                    case 'ne':
                        return item[conditional.column] !== conditional.target;
                    case 'nu':
                        return item[conditional.column] !== undefined;
                    case 'nn':
                        return item[conditional.column] != null;
                    case 'nb':
                        return item[conditional.column] !== '';
                    case 'nunb':
                        return item[conditional.column] !== undefined && item[conditional.column] != null && item[conditional.column] !== '';
                    case 'iu':
                        return item[conditional.column] === undefined;
                    case 'in':
                        return item[conditional.column] == null;
                    case 'ib':
                        return item[conditional.column] === '';
                    case 'iunb':
                        return item[conditional.column] === undefined || item[conditional.column] == null || item[conditional.column] === '';
                    case 'dgt':
                        return moment(item[conditional.column]).isValid() && moment(conditional.target).isValid() && moment(item[conditional.column]).isSameOrAfter(moment(conditional.target));
                    case 'dlt':
                        return moment(item[conditional.column]).isValid() && moment(conditional.target).isValid() && moment(item[conditional.column]).isSameOrBefore(moment(conditional.target));
                    default:
                        return false;
                    }
                } else {
                    let bool = true;
                    for (let i = 0; i < conditional.length; i += 2) {
                        let subBool = true;
                        switch (conditional[i].inequality) {
                        case 'gt':
                            subBool = item[conditional[i].column] > conditional[i].target;
                            break;
                        case 'ge':
                            subBool = item[conditional[i].column] >= conditional[i].target;
                            break;
                        case 'lt':
                            subBool = item[conditional[i].column] < conditional[i].target;
                            break;
                        case 'le':
                            subBool = item[conditional[i].column] <= conditional[i].target;
                            break;
                        case 'eq':
                            subBool = item[conditional[i].column] === conditional[i].target;
                            break;
                        case 'ne':
                            subBool = item[conditional[i].column] !== conditional[i].target;
                            break;
                        case 'nu':
                            subBool = item[conditional[i].column] !== undefined;
                            break;
                        case 'nn':
                            subBool = item[conditional[i].column] != null;
                            break;
                        case 'nb':
                            subBool = item[conditional[i].column] !== '';
                            break;
                        case 'nunb':
                            subBool = item[conditional[i].column] !== undefined && item[conditional[i].column] != null && item[conditional[i].column] !== '';
                            break;
                        case 'iu':
                            subBool = item[conditional[i].column] === undefined;
                            break;
                        case 'in':
                            subBool = item[conditional[i].column] == null;
                            break;
                        case 'ib':
                            subBool = item[conditional[i].column] === '';
                            break;
                        case 'iunb':
                            subBool = item[conditional[i].column] === undefined || item[conditional[i].column] == null || item[conditional[i].column] === '';
                            break;
                        case 'dgt':
                            subBool = moment(item[conditional[i].column]).isValid() && moment(conditional[i].target).isValid() && moment(item[conditional[i].column]).isSameOrAfter(moment(conditional[i].target));
                            break;
                        case 'dlt':
                            subBool = moment(item[conditional[i].column]).isValid() && moment(conditional[i].target).isValid() && moment(item[conditional[i].column]).isSameOrBefore(moment(conditional[i].target));
                            break;
                        default:
                            subBool = false;
                        }
                        if (i === 0) {
                            bool = subBool;
                        } else if (conditional[i - 1].toUpperCase() === 'AND') {
                            bool = bool && subBool;
                        } else if (conditional[i - 1].toUpperCase() === 'OR') {
                            bool = bool || subBool;
                        }
                    }
                    return bool;
                }
            } else {
                return true;
            }
        },
        getClass(conditional, item) {
            let bool = false;
            if (conditional !== undefined && conditional !== null) {
                if (conditional[0] === undefined) {
                    switch (conditional.inequality) {
                    case 'gt':
                        bool = item[conditional.column] > conditional.target;
                        break;
                    case 'ge':
                        bool = item[conditional.column] >= conditional.target;
                        break;
                    case 'lt':
                        bool = item[conditional.column] < conditional.target;
                        break;
                    case 'le':
                        bool = item[conditional.column] <= conditional.target;
                        break;
                    case 'eq':
                        bool = item[conditional.column] === conditional.target;
                        break;
                    case 'ne':
                        bool = item[conditional.column] !== conditional.target;
                        break;
                    case 'nu':
                        bool = item[conditional.column] !== undefined;
                        break;
                    case 'nn':
                        bool = item[conditional.column] != null;
                        break;
                    case 'nb':
                        bool = item[conditional.column] !== '';
                        break;
                    case 'nunb':
                        bool = item[conditional.column] !== undefined && item[conditional.column] != null && item[conditional.column] !== '';
                        break;
                    case 'iu':
                        bool = item[conditional.column] === undefined;
                        break;
                    case 'in':
                        bool = item[conditional.column] == null;
                        break;
                    case 'ib':
                        bool = item[conditional.column] === '';
                        break;
                    case 'iunb':
                        bool = item[conditional.column] === undefined || item[conditional.column] == null || item[conditional.column] === '';
                        break;
                    case 'dgt':
                        bool = moment(item[conditional.column]).isValid() && moment(conditional.target).isValid() && moment(item[conditional.column]).isSameOrAfter(moment(conditional.target));
                        break;
                    case 'dlt':
                        bool = moment(item[conditional.column]).isValid() && moment(conditional.target).isValid() && moment(item[conditional.column]).isSameOrBefore(moment(conditional.target));
                        break;
                    default:
                        bool = false;
                    }
                    if (bool) {
                        return conditional.cssClass;
                    }
                    return (conditional !== null && conditional.defaultClass !== undefined && conditional.defaultClass !== null) ? conditional.defaultClass : '';
                }
                for (let i = 0; i < conditional.length; i += 1) {
                    switch (conditional[i].inequality) {
                    case 'gt':
                        bool = item[conditional[i].column] > conditional[i].target;
                        break;
                    case 'ge':
                        bool = item[conditional[i].column] >= conditional[i].target;
                        break;
                    case 'lt':
                        bool = item[conditional[i].column] < conditional[i].target;
                        break;
                    case 'le':
                        bool = item[conditional[i].column] <= conditional[i].target;
                        break;
                    case 'eq':
                        bool = item[conditional[i].column] === conditional[i].target;
                        break;
                    case 'ne':
                        bool = item[conditional[i].column] !== conditional[i].target;
                        break;
                    case 'nu':
                        bool = item[conditional[i].column] !== undefined;
                        break;
                    case 'nn':
                        bool = item[conditional[i].column] != null;
                        break;
                    case 'nb':
                        bool = item[conditional[i].column] !== '';
                        break;
                    case 'nunb':
                        bool = item[conditional[i].column] !== undefined && item[conditional[i].column] != null && item[conditional[i].column] !== '';
                        break;
                    case 'iu':
                        bool = item[conditional[i].column] === undefined;
                        break;
                    case 'in':
                        bool = item[conditional[i].column] == null;
                        break;
                    case 'ib':
                        bool = item[conditional[i].column] === '';
                        break;
                    case 'iunb':
                        bool = item[conditional[i].column] === undefined || item[conditional[i].column] == null || item[conditional[i].column] === '';
                        break;
                    case 'dgt':
                        bool = moment(item[conditional[i].column]).isValid() && moment(conditional[i].target).isValid() && moment(item[conditional[i].column]).isSameOrAfter(moment(conditional[i].target));
                        break;
                    case 'dlt':
                        bool = moment(item[conditional[i].column]).isValid() && moment(conditional[i].target).isValid() && moment(item[conditional[i].column]).isSameOrBefore(moment(conditional[i].target));
                        break;
                    default:
                        bool = false;
                    }
                    if (bool) {
                        return conditional[i].cssClass;
                    }
                }
                return (conditional.defaultClass !== undefined && conditional.defaultClass !== null) ? conditional.defaultClass : '';
            }
            return '';
        },
        clickStyleText(item, header) {
            const clicked = { item, header };
            this.$emit('click:styleText', clicked);
        },
        clickHtml(item, header) {
            const clicked = { item, header };
            this.$emit('click:html', clicked);
        },
        toggleStatus(headerType, rKey) {
            this.$set(this.cell[headerType].readonlyFlag, rKey, false);
        },
        enterTextField(item, headerType, rKey) {
            item.memo = this.cell[headerType].memo[rKey];
            this.$set(this.cell[headerType].readonlyFlag, rKey, true);
            this.$emit('enter:clickAfterTextField', item);
        },
        checkAllClick(newValue) {
            if (newValue) {
                this.data = this.items;
            } else {
                this.data = [];
            }
        },
    },
    created() {
        this.options = {
            page: this.page,
            itemsPerPage: this.itemsPerPage,
            sortBy: this.sortBy,
            sortDesc: this.sortDesc,
            groupBy: this.groupBy,
            groupDesc: this.groupDesc,
            multiSort: this.multiSort,
            mustSort: this.mustSort,
        };
    },
});
</script>

<style scoped>
.v-data-table-header {
    /* background-color: #F5F6FA; */
    /* color: white; */
}
.v-data-table-header tr th span{
    /* color: white; */
}
</style>
