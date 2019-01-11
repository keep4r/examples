import { on } from '@ember/object/evented';
import { not } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/wb-md-button';

//import mixins
import componentSetup, { tryInvokeAsync } from '../mixins/component-setup';
import configSetup from '../mixins/config-setup';

export default Component.extend(componentSetup, configSetup, {
    layout,
    classNames: ['button'],
    classNameBindings: [
        'buttonColor',
        'buttonBackground',
        'buttonSize',
        'primary:button_type_raised',
        'darkType:button_type_dark',
        'lightType:button_type_light',
        'disabled:button_status_disabled',
        'asyncPending:button_status_disabled',
        'readonly:button_status_readonly',
        'ripple:global-ripple'
    ],
    ripple: true,
    ripplePositioned: true,
    label: null,
    size: 'normal',
    color: 'white',
    background: 'indigo-500',
    primary: true,
    disabled: false,
    readonly: false,
    //computed properties
    buttonColor: computed('color', {
        get() {
            let color = this.get('color');
            return this.setupClassNamesFromProperty('material_color_', color);
        }
    }),
    buttonBackground: computed('background', {
        get() {
            let background = this.get('background');
            return this.setupClassNamesFromProperty('material_background_', background);
        }
    }),
    buttonSize: computed('size', {
        get() {
            let size = this.get('size');
            return this.setupClassNamesFromProperty('button_size_', size);
        }
    }),
    darkType: computed('background', {
        get() {
            let color = this.get('background'),
                darkType = this.checkDarkColor(color);
            return darkType;
        }
    }),
    lightType: not('darkType'),
    //private functions
    clickInvoke: on('click', function () {
        tryInvokeAsync(this, 'onClick');
    })
});