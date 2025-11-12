import React from 'react';

export const LeafIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 4H13V5H14V6H15V7H16V8H17V10H16V12H15V13H14V14H13V15H14V16H13V17H12V18H11V19H10V18H9V16H8V15H7V14H6V12H7V11H8V10H9V9H10V8H11V6H12V4Z" fill="#68A741"/>
    <path d="M11 6H12V4H13V5H14V6H15V7H16V8H17V10H16V9H15V8H14V7H13V6H12V7H11V6Z" fill="#99E550"/>
    <path d="M9 16H8V15H7V14H6V12H7V11H8V10H9V9H10V8H11V18H10V17H9V16Z" fill="#4A5547"/>
    <path d="M10 18H11V19H10V18Z" fill="#4A5547"/>
    <path d="M12 17H13V16H14V15H13V14H14V13H15V12H16V10H15V11H14V12H13V13H12V17Z" fill="#4A5547"/>
  </svg>
);


export const GrassPattern: React.FC = () => (
    <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
            <pattern id="grass" patternUnits="userSpaceOnUse" width="48" height="48">
                <rect width="48" height="48" fill="#426b38" />
                {/* Vines */}
                <rect x="2" y="0" width="4" height="4" fill="#375a2f" />
                <rect x="6" y="4" width="4" height="4" fill="#375a2f" />
                <rect x="10" y="8" width="4" height="4" fill="#375a2f" />
                <rect x="30" y="20" width="4" height="4" fill="#375a2f" />
                <rect x="34" y="24" width="4" height="4" fill="#375a2f" />
                <rect x="38" y="28" width="4" height="4" fill="#375a2f" />
                <rect x="10" y="30" width="4" height="4" fill="#375a2f" />
                <rect x="6" y="34" width="4" height="4" fill="#375a2f" />
                <rect x="2" y="38" width="4" height="4" fill="#375a2f" />
                 {/* Leaves */}
                <g>
                    <rect x="20" y="5" width="2" height="2" fill="#7ac46b" />
                    <rect x="18" y="7" width="6" height="2" fill="#7ac46b" />
                    <rect x="20" y="9" width="2" height="2" fill="#7ac46b" />
                    <rect x="22" y="7" width="2" height="4" fill="#5a914d" />
                </g>
                <g>
                    <rect x="40" y="15" width="2" height="2" fill="#68a741" />
                    <rect x="38" y="17" width="6" height="2" fill="#68a741" />
                    <rect x="40" y="19" width="2" height="2" fill="#68a741" />
                </g>
                <g>
                    <rect x="25" y="38" width="2" height="2" fill="#99e550" />
                    <rect x="23" y="40" width="6" height="2" fill="#99e550" />
                    <rect x="25" y="42" width="2" height="2" fill="#99e550" />
                    <rect x="27" y="40" width="2" height="4" fill="#68a741" />
                </g>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grass)" />
    </svg>
);