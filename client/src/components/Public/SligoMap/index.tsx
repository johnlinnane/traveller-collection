import React from 'react';
import { connect } from 'react-redux';

const SligoMap = (props: any) => {

    return (
        <div
            style={{
                position: 'relative', // Set container position to relative
                width: '100vw', // 100% of viewport width
                height: '100vh', // 100% of viewport height
                margin: 0,
                padding: 0,
                overflow: 'hidden'
            }}
        >
            <img
                alt="MapUpdated"
                src="/assets/media/sligo-map/MapUpdated.png"
                style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', 
                    zIndex: -1 
                }}
            />
            <img 
                alt="Leafy Frame"
                src="/assets/media/sligo-map/Frame-Full.png"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />

        </div>
    );
}

function mapStateToProps(state: any) {
    return {
        // items: state.items
    }
}

export default connect(mapStateToProps)(SligoMap);