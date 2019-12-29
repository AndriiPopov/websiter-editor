export const systemClassMenu = `
<style>
                        @font-face {
                        font-family: 'FontAwesome';
                        src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.eot');
                        src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.eot?#iefix')
                                format('embedded-opentype'),
                            url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.woff')
                                format('woff'),
                            url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.ttf')
                                format('truetype'),
                            url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/fonts/fontawesome-webfont.svg?#fontawesomeregular')
                                format('svg');
                        font-weight: normal;
                        font-style: normal;
                    }
                    .systemclass_menu {
                        list-style: none;
                            margin: 0px;
    padding: 0px;
                    }
                    .systemclass_menu-hidden {
                        display: none;
                    }
                    .systemclass_menu-collapse {
                        overflow: hidden;
                        transition: height 0.3s ease-out;
                    }
                    .systemclass_menu-item-group-list {
                        margin: 0;
                        padding: 0;
                    }
                    .systemclass_menu-item-group-title {
                        color: #999;
                        line-height: 1.5;
                        
                        border-bottom: 1px solid #dedede;
                    }
                    
                    .systemclass_menu-item-selected {
                        background-color: #eaf8fe;
                        transform: translateZ(0);
                    }
                    .systemclass_menu-submenu-selected {
                        background-color: #eaf8fe;
                    }
                    .systemclass_menu > li.systemclass_menu-submenu {
                        padding: 0;
                    }
                    .systemclass_menu-horizontal.systemclass_menu-sub,
                    .systemclass_menu-vertical.systemclass_menu-sub,
                    .systemclass_menu-vertical-left.systemclass_menu-sub,
                    .systemclass_menu-vertical-right.systemclass_menu-sub {
                        
                        margin-top: 0;
                    }
                    .systemclass_menu-item,
                    .systemclass_menu-submenu-title {
                        margin: 0;
                        position: relative;
                        display: block;
                        padding: 0px;
                        white-space: nowrap;
                    }
                    .systemclass_menu-item.systemclass_menu-item-disabled,
                    .systemclass_menu-submenu-title.systemclass_menu-item-disabled,
                    .systemclass_menu-item.systemclass_menu-submenu-disabled,
                    .systemclass_menu-submenu-title.systemclass_menu-submenu-disabled {
                        color: #777 !important;
                    }
                    .systemclass_menu > .systemclass_menu-item-divider {
                        height: 1px;
                        margin: 1px 0;
                        overflow: hidden;
                        padding: 0;
                        line-height: 0;
                        background-color: #e5e5e5;
                    }
                    .systemclass_menu-submenu-popup {
                        position: absolute;
                    }
                    .systemclass_menu-submenu-popup .submenu-title-wrapper {
                        padding-right: 20px;
                    }
                    
                    .systemclass_menu .systemclass_menu-submenu-title .anticon,
                    .systemclass_menu .systemclass_menu-item .anticon {
                        width: 14px;
                        height: 14px;
                        
                        top: -1px;
                    }
                    .systemclass_menu-horizontal {
                        border: none;
                        box-shadow: none;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .systemclass_menu-horizontal > .systemclass_menu-item,
                    .systemclass_menu-horizontal
                        > .systemclass_menu-submenu
                        > .systemclass_menu-submenu-title {
                        
                    }
                    .systemclass_menu-horizontal > .systemclass_menu-submenu,
                    .systemclass_menu-horizontal > .systemclass_menu-item {
                        
                        display: inline-block;
                        vertical-align: bottom;
                    }
                    
                    .systemclass_menu-horizontal:after {
                        content: ' ';
                        display: block;
                        height: 0;
                        clear: both;
                    }
                    .systemclass_menu-vertical,
                    .systemclass_menu-vertical-left,
                    .systemclass_menu-vertical-right,
                    .systemclass_menu-inline {
                        
                    }
                    .systemclass_menu-vertical > .systemclass_menu-item,
                    .systemclass_menu-vertical-left > .systemclass_menu-item,
                    .systemclass_menu-vertical-right > .systemclass_menu-item,
                    .systemclass_menu-inline > .systemclass_menu-item,
                    .systemclass_menu-vertical
                        > .systemclass_menu-submenu
                        > .systemclass_menu-submenu-title,
                    .systemclass_menu-vertical-left
                        > .systemclass_menu-submenu
                        > .systemclass_menu-submenu-title,
                    .systemclass_menu-vertical-right
                        > .systemclass_menu-submenu
                        > .systemclass_menu-submenu-title,
                    .systemclass_menu-inline
                        > .systemclass_menu-submenu
                        > .systemclass_menu-submenu-title {
                        
                    }
                    .systemclass_menu-vertical .systemclass_menu-submenu-arrow,
                    .systemclass_menu-vertical-left
                        .systemclass_menu-submenu-arrow,
                    .systemclass_menu-vertical-right
                        .systemclass_menu-submenu-arrow,
                    .systemclass_menu-inline .systemclass_menu-submenu-arrow {
                        display: inline-block;
                        font: normal normal normal 14px/1 FontAwesome;
                        font-size: inherit;
                        vertical-align: baseline;
                        text-align: center;
                        text-transform: none;
                        text-rendering: auto;
                        position: absolute;
                        right: 16px;
                        line-height: 1.5em;
                    }
                    .systemclass_menu-vertical
                        .systemclass_menu-submenu-arrow:before,
                    .systemclass_menu-vertical-left
                        .systemclass_menu-submenu-arrow:before,
                    .systemclass_menu-vertical-right
                        .systemclass_menu-submenu-arrow:before,
                    .systemclass_menu-inline
                        .systemclass_menu-submenu-arrow:before {
                        content: '\f0da';
                    }
                    .systemclass_menu-inline .systemclass_menu-submenu-arrow {
                        transform: rotate(90deg);
                        transition: transform 0.3s;
                    }
                    .systemclass_menu-inline
                        .systemclass_menu-submenu-open
                        > .systemclass_menu-submenu-title
                        .systemclass_menu-submenu-arrow {
                        transform: rotate(-90deg);
                    }
                    .systemclass_menu-vertical.systemclass_menu-sub,
                    .systemclass_menu-vertical-left.systemclass_menu-sub,
                    .systemclass_menu-vertical-right.systemclass_menu-sub {
                        padding: 0;
                    }

                    .systemclass_menu-sub.systemclass_menu-inline {
                        padding: 0;
                        border: none;
                        border-radius: 0;
                        box-shadow: none;
                    }
                    .systemclass_menu-sub.systemclass_menu-inline
                        > .systemclass_menu-item,
                    .systemclass_menu-sub.systemclass_menu-inline
                        > .systemclass_menu-submenu
                        > .systemclass_menu-submenu-title {
                        
                        padding: 0;
                    }
                    .systemclass_menu-open-slide-up-enter,
                    .systemclass_menu-open-slide-up-appear {
                        animation-duration: 0.3s;
                        animation-fill-mode: both;
                        transform-origin: 0 0;
                        opacity: 0;
                        animation-timing-function: cubic-bezier(
                            0.08,
                            0.82,
                            0.17,
                            1
                        );
                        animation-play-state: paused;
                    }
                    .systemclass_menu-open-slide-up-leave {
                        animation-duration: 0.3s;
                        animation-fill-mode: both;
                        transform-origin: 0 0;
                        opacity: 1;
                        animation-timing-function: cubic-bezier(
                            0.6,
                            0.04,
                            0.98,
                            0.34
                        );
                        animation-play-state: paused;
                    }
                    .systemclass_menu-open-slide-up-enter.systemclass_menu-open-slide-up-enter-active,
                    .systemclass_menu-open-slide-up-appear.systemclass_menu-open-slide-up-appear-active {
                        animation-name: systemclassMenuOpenSlideUpIn;
                        animation-play-state: running;
                    }
                    .systemclass_menu-open-slide-up-leave.systemclass_menu-open-slide-up-leave-active {
                        animation-name: systemclassMenuOpenSlideUpOut;
                        animation-play-state: running;
                    }
                    @keyframes systemclassMenuOpenSlideUpIn {
                        0% {
                            opacity: 0;
                            transform-origin: 0% 0%;
                            transform: scaleY(0);
                        }
                        100% {
                            opacity: 1;
                            transform-origin: 0% 0%;
                            transform: scaleY(1);
                        }
                    }
                    @keyframes systemclassMenuOpenSlideUpOut {
                        0% {
                            opacity: 1;
                            transform-origin: 0% 0%;
                            transform: scaleY(1);
                        }
                        100% {
                            opacity: 0;
                            transform-origin: 0% 0%;
                            transform: scaleY(0);
                        }
                    }
                    .systemclass_menu-open-zoom-enter,
                    .systemclass_menu-open-zoom-appear {
                        opacity: 0;
                        animation-duration: 0.3s;
                        animation-fill-mode: both;
                        transform-origin: 0 0;
                        animation-timing-function: cubic-bezier(
                            0.08,
                            0.82,
                            0.17,
                            1
                        );
                        animation-play-state: paused;
                    }
                    .systemclass_menu-open-zoom-leave {
                        animation-duration: 0.3s;
                        animation-fill-mode: both;
                        transform-origin: 0 0;
                        animation-timing-function: cubic-bezier(
                            0.6,
                            0.04,
                            0.98,
                            0.34
                        );
                        animation-play-state: paused;
                    }
                    .systemclass_menu-open-zoom-enter.systemclass_menu-open-zoom-enter-active,
                    .systemclass_menu-open-zoom-appear.systemclass_menu-open-zoom-appear-active {
                        animation-name: systemclassMenuOpenZoomIn;
                        animation-play-state: running;
                    }
                    .systemclass_menu-open-zoom-leave.systemclass_menu-open-zoom-leave-active {
                        animation-name: systemclassMenuOpenZoomOut;
                        animation-play-state: running;
                    }
                    @keyframes systemclassMenuOpenZoomIn {
                        0% {
                            opacity: 0;
                            transform: scale(0, 0);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1, 1);
                        }
                    }
                    @keyframes systemclassMenuOpenZoomOut {
                        0% {
                            transform: scale(1, 1);
                        }
                        100% {
                            opacity: 0;
                            transform: scale(0, 0);
                        }
                    }
                    </style>
`
