import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Autoplay } from 'swiper/modules';
import Api from '../../services/Api';
import CustomModal from '../../components/CustomModal';

export default function Flash() {
  
  const [activeSection, setActiveSection] = useState('section3');

 
  const tabs = [
    { id: 'section3', label: 'Mini Games' },
    { id: 'section4', label: 'Lottery' },
    { id: 'section5', label: 'Casino' },
    { id: 'section6', label: 'Fishing' },
    { id: 'section7', label: 'Rummy' },
    { id: 'section8', label: 'Slot' },
    
 
  ];


  const navigate = useNavigate();
  
  const [isSecondVisible, setIsSecondVisible] = useState(false);
  const [selectSection, isSelectSection] = useState();
  const [betRecords, setBetRecords] = useState([]);
  
  const [isSan, setIsSan] = useState('san3');
  const [isMonth, setIsMonth] = useState('month8');
  const [isDate, setIsDate] = useState('Date1')
  
  const [winners, setWinners] = useState([]);

  // const showSection = (sectionId) => {
  //   setActiveSection(sectionId);
  // };

  const [isModalOpen, setIsModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [gameId, setGameId] = useState(null);
    const [checkRecharge, setCheckRecharge] = useState(1);
    const [rechargePopup, setRechargePopup] = useState(0); // Assume this state controls the popup
  
  
    
  
    const handleGameClick = async (gameId) => {
  console.log('heloo');
      if (checkRecharge === 1) {
        setGameId(gameId);
        setIsModalOpen(true);
      } else {
        setRechargePopup(1);
      }
  
  
      // setGameId(gameId);
      // setIsModalOpen(true); 
    };
  
    const handlePopupConfirm = async () => {
      setIsModalOpen(false); // Close the modal after confirming
  
      try {
        const { data: userInfo } = await Api.get('/api/webapi/GetUserInfo');
        setUserInfo(userInfo.data);
  
        const { money_user, thirdparty_wallet } = userInfo.data;
  
        if (money_user > 0) {
          const response = await Api.post('/aviatorMoneySend');
          if (response.data.status) {
            await loginToAviatorGame();
          } else {
            console.error('Failed to send balance:', response.data.message);
          }
        } else if (thirdparty_wallet > 0) {
          await loginToAviatorGame();
        } else {
          console.error('Insufficient balance');
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };
  
    const handlePopupCancel = () => {
      setIsModalOpen(false); // Close the modal when Cancel is clicked
    };
  
  
    const fetchRecharge = async () => {
      try {
        const response = await Api.get('/api/webapi/checkRecharge');
        const data = response.data;
        setCheckRecharge(data.data);
      } catch (err) {
        console.error('An error occurred:', err);
        setError('An error occurred. Please try again.');
      }
    };
  
    const handleNavigation = async (path) => {
      await fetchRecharge(); // Ensure `checkRecharge` is updated before navigating
  
      if (checkRecharge === 1) {
        navigate(path);
      } else {
        setRechargePopup(1);
      }
    };
  
    const openInSameTab = (url) => {
      window.location.href = url;
    };
  const aviatorGameIds = [
       'a04d1f3eb8ccec8a4823bdf18e3f0e84'
      ];
  
  const jiliGameIds = [
    
    // add more Jili IDs here
  ];
    const loginToAviatorGame = async () => {
      try {
        let response;
        // const response = await Api.post(`/aviatorgame/${gameId}`);
          if (aviatorGameIds.includes(gameId)) {
        // 🐔 Chicken game API
        response = await Api.post(`/aviatorgame/${gameId}`);
      } 
      else {
        // ✈ Aviator game API
         response = await Api.post(`/chickengame/${gameId}`);
      }
  
        console.log('Login response:', response);
        if (response.data.status) {
         
             window.open(response.data.data, '_blank', 'noopener,noreferrer');
        } else {
          console.error('Login failed:', response.data.message);
        }
      } catch (error) {
        console.error('Error occurred while logging in:', error);
      }
    };
  
    // Function to show the selected section
    const showSection = (sectionId) => {
      setActiveSection(sectionId);
    };
  
    const [activeLink , setActiveLink] = useState(null);
  
    useEffect(()=>{
      const currentPath = window.location.pathname;
    setActiveLink(currentPath);
  
    fetchRecharge();
  
  },[]);
  
  const [isVisible, setIsVisible] = useState(true);
    const [error, setError] = useState(null); 
    useEffect(() => {
      // Check if the button has been closed before by the user
      const isClosed = localStorage.getItem('addToDesktopClosed');
      if (isClosed) {
        setIsVisible(false);
      }
    }, []);
  
    const handleClose = () => {
      // Set the flag in localStorage to remember the user closed it
      localStorage.setItem('addToDesktopClosed', 'true');
      setIsVisible(false);
    };
  
  
    // Function to download the APK
    // const handleDownloadAPK = () => {
    //   // Path to the APK file inside the public folder
    //   const apkUrl = `https://khelmantra.co/apk/KhelMantra.apk`; // Adjust the path if necessary
  
    //   // Create a hidden anchor tag and trigger the download
    //   const link = document.createElement('a');
    //   link.href = apkUrl;
    //   link.download = 'KhelMantra.apk'; // Optional: specify the file name
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
  
    //   localStorage.setItem('addToDesktopClosed', 'true');
    //   setIsVisible(false);
    // };
  



  const formatTimestampToIST = (timestamp) => {
    try {
      // Convert the timestamp to a number if it's in string format
      const numericTimestamp = Number(timestamp);

      // If the timestamp is in seconds (10 digits), convert it to milliseconds
      const validTimestamp = numericTimestamp.toString().length === 13 ? numericTimestamp : numericTimestamp * 1000;

      // Create a Date object from the valid timestamp
      const date = new Date(validTimestamp);

      // Check if the Date object is valid
      if (isNaN(date.getTime())) {
        throw new Error('Invalid Date');
      }

      // Format the date in IST
      return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    } catch (error) {
      return 'Invalid Timestamp';
    }
  };



  const handleSection = () => {
    isSelectSection(selectSection);
  };

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };
  const handleCancel = () => {
    setIsVisible(false);
  };
  const handleSecondToggle = () => {
    setIsSecondVisible(!isSecondVisible);
  };
  const handleSecondCancel = () => {
    setIsSecondVisible(false);
  };


  const san = (sanId) => {
    setIsSan(sanId)
  }

  const month = (monthId) => {
    setIsMonth(monthId)
  }
  const Date = (DateId) => {
    setIsDate(DateId)
  }
  return (
    <div style={{ fontSize: '12px' }}>


      <div id="app" data-v-app="">
        <CustomModal
                isOpen={isModalOpen}
                onClose={handlePopupCancel}
                onConfirm={handlePopupConfirm}
                contentLabel="Confirmation"
                className="Modal"
                overlayclassName="Overlay"
              />
              
        <div
          data-v-647954c7=""
          className="ar-loading-view"
          style={{
            '--f13b4d11-currentFontFamily': "'Roboto', 'Inter', 'sansSerif'",
            display: 'none'
          }}
        >
          <div data-v-647954c7="" className="loading-wrapper">
            <div data-v-647954c7="" className="loading-animat">
              <svg
                xmlns="http://www.w3.org/2000/svg"

                viewBox="0 0 200 200"
                width="200"
                height="200"
                preserveAspectRatio="xMidYMid meet"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: 'translate3d(0px, 0px, 0px)',
                  contentVisibility: 'visible'
                }}
              >
                <defs>
                  <clipPath id="__lottie_element_2">
                    <rect width="200" height="200" x="0" y="0"></rect>
                  </clipPath>
                  <image
                    href="data:image/png;base64,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"
                  ></image>
                  <image
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAHlBMVEVHcEy/GyDCGiHCGiDBGiHBGiLBGiG/GyC/HCDBGiEYgX5lAAAACXRSTlMAFupex4emMEAHMN8rAAAEw0lEQVR42u1cy1ITQRTtYTKZsAsQLLODUsDeoVWC2YGSSHYC8ZEdolU6Owopq9gpisJOhwS5f2vPDENek2QefW5ZyF0BReZM9z3nPjrdLURimxJwM+p0Dw5SIqJl9ECaCmQO93z7pLFBvv1BjeDkPV3bJQbicZ267DcC4ySAcGsvT3+W1Q+7+iHMPR+huhr8RtQqasf4IRVEa+f6wbM17Qw2tr1RvCsiZVFwFMbCPlR6pvK4+xorb1O542IZj7FQxGIUFAY64Np1PIYXbuGJ4xEDhspNbbDPPWK10BiGQy46x4pjoi00hsXgdFX1XKAdIg7wRY/HrCV4+VbBs1fkIYVCnzl0LvADwctQ0Rfv9RK5+wweWWfwCJ6+aiDzcAyLwyMVBmrZHAOZZhC7EuIyA38vBIPb8UK0pYsXYonB7aJJL+AYBWoJBpEsccwWXiQ2x2zlMCsm/UrEc8uQLn4gFmgRq8fKtIYHcQgftwyOKJ/nIHCZgcDCcW+ISywOl0wzNFcqcOGLOlFnCPM2RwmRR35ZEdoEhxRZ/O4wJCyDw+8mh97zHFmRhVxHHORqMpBL1BmSieBgcIGDwRZHeMxzpEUWmZTpCx7kjKEM5tGi0+IQfJsBRDIIXnA0cjZsX0UPyC+O+MgAYnJk+JsDYnFEeosj0t+CxLXDIh7EkGt4kCCg3IL8SyCmX5+CY5flP/4mgUCL+pwf5ME5Pufzysb2QBPBNybYumsy6BmwLWM56N+xtfAZBVU9tMO+akya0NbhqjGpEENjcgTtGa9oNYn87i/sGXLI6s68iicWMkKGC3bQtZVwJQK6zlkOHY6UfCVciUCuFlwvElSA6x6y3T9vCJlcXtMMJpTOgh1whbsjdOB3NF2ewK3ZNjucwtFLXkQNSje5zruiGKi+636wiaqKprs7BgnyfI+zmyDPy1YPnSGNUKFHgHnM9sdcD6EKGM2f9U5QHZJS+vYrVBByNKjdl+/nEFKc7yuPzuEu8ZyiXykDzzzTrxST2gOU1p4dJwbEZ+vfuRKxiU/7vj5DtiKi8rxuAl/GcFPmMB9RaNX1NlxG5HZazfOVj5S3pXe+KtFlqdbN1caQzcda5ys3JBiaOnenDt187Oir7s2hZyY07q8+GLr52Ja6tn0YcjiJtB11KI2Qg6Xr9MlI72o6RzP6qExOD4ubIxVn1HWw2BxzwqSkI0GO449i8W72gYwLggfZh1IZq2k1lPWs1BofzQ+yaiXOAb+sh+finYtT/5Uh2dvx3lENJUMwPqbWfkzPvc1A3/W4HIz3NhGz4MRWQEGmPVt8nOAw72HKCbOIHiQJo2kOmipmJdGYKdMclG4mPPl8J8WRb+WQ58k+8YhoM9kn1Hu1k5MxmfNnZQrie7dIbCXyYhquqFdztxJgpGO9muS4KDMysQs78ZjoQ8xBp8UQ4rtCeTZeLyuU6Y6Dz+rji2M4498tsykymDcRo291+eTd9PMxW1kw4z1jcSg5Cw2iBCQcGvW82aBqZEa2V7ybfrTcLeM/iapPBiaq4V+JpOmmH3M7uGCp+uZr+Ke7314Fty4tPtTWZs7shddE3d9Q9jT8bXFV60rJTIMGrKYXwtfDSUN2ANzazr7AmDF16ttUUfyf9hdhzrd5F3WCHQAAAABJRU5ErkJggg=="
                  ></image>
                </defs>
                <g clipPath="url(#__lottie_element_2)">
                  <g
                    className="ai"
                    transform="matrix(1,0,0,1,0,0)"
                    opacity="1"
                    style={{ display: 'block' }}
                  >
                    <image
                      width="200px"
                      height="200px"
                      preserveAspectRatio="xMidYMid slice"
                      href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAHlBMVEVHcEy/GyDCGiHCGiDBGiHBGiLBGiG/GyC/HCDBGiEYgX5lAAAACXRSTlMAFupex4emMEAHMN8rAAAEw0lEQVR42u1cy1ITQRTtYTKZsAsQLLODUsDeoVWC2YGSSHYC8ZEdolU6Owopq9gpisJOhwS5f2vPDENek2QefW5ZyF0BReZM9z3nPjrdLURimxJwM+p0Dw5SIqJl9ECaCmQO93z7pLFBvv1BjeDkPV3bJQbicZ267DcC4ySAcGsvT3+W1Q+7+iHMPR+huhr8RtQqasf4IRVEa+f6wbM17Qw2tr1RvCsiZVFwFMbCPlR6pvK4+xorb1O542IZj7FQxGIUFAY64Np1PIYXbuGJ4xEDhspNbbDPPWK10BiGQy46x4pjoi00hsXgdFX1XKAdIg7wRY/HrCV4+VbBs1fkIYVCnzl0LvADwctQ0Rfv9RK5+wweWWfwCJ6+aiDzcAyLwyMVBmrZHAOZZhC7EuIyA38vBIPb8UK0pYsXYonB7aJJL+AYBWoJBpEsccwWXiQ2x2zlMCsm/UrEc8uQLn4gFmgRq8fKtIYHcQgftwyOKJ/nIHCZgcDCcW+ISywOl0wzNFcqcOGLOlFnCPM2RwmRR35ZEdoEhxRZ/O4wJCyDw+8mh97zHFmRhVxHHORqMpBL1BmSieBgcIGDwRZHeMxzpEUWmZTpCx7kjKEM5tGi0+IQfJsBRDIIXnA0cjZsX0UPyC+O+MgAYnJk+JsDYnFEeosj0t+CxLXDIh7EkGt4kCCg3IL8SyCmX5+CY5flP/4mgUCL+pwf5ME5Pufzysb2QBPBNybYumsy6BmwLWM56N+xtfAZBVU9tMO+akya0NbhqjGpEENjcgTtGa9oNYn87i/sGXLI6s68iicWMkKGC3bQtZVwJQK6zlkOHY6UfCVciUCuFlwvElSA6x6y3T9vCJlcXtMMJpTOgh1whbsjdOB3NF2ewK3ZNjucwtFLXkQNSje5zruiGKi+636wiaqKprs7BgnyfI+zmyDPy1YPnSGNUKFHgHnM9sdcD6EKGM2f9U5QHZJS+vYrVBByNKjdl+/nEFKc7yuPzuEu8ZyiXykDzzzTrxST2gOU1p4dJwbEZ+vfuRKxiU/7vj5DtiKi8rxuAl/GcFPmMB9RaNX1NlxG5HZazfOVj5S3pXe+KtFlqdbN1caQzcda5ys3JBiaOnenDt187Oir7s2hZyY07q8+GLr52Ja6tn0YcjiJtB11KI2Qg6Xr9MlI72o6RzP6qExOD4ubIxVn1HWw2BxzwqSkI0GO449i8W72gYwLggfZh1IZq2k1lPWs1BofzQ+yaiXOAb+sh+finYtT/5Uh2dvx3lENJUMwPqbWfkzPvc1A3/W4HIz3NhGz4MRWQEGmPVt8nOAw72HKCbOIHiQJo2kOmipmJdGYKdMclG4mPPl8J8WRb+WQ58k+8YhoM9kn1Hu1k5MxmfNnZQrie7dIbCXyYhquqFdztxJgpGO9muS4KDMysQs78ZjoQ8xBp8UQ4rtCeTZeLyuU6Y6Dz+rji2M4498tsykymDcRo291+eTd9PMxW1kw4z1jcSg5Cw2iBCQcGvW82aBqZEa2V7ybfrTcLeM/iapPBiaq4V+JpOmmH3M7uGCp+uZr+Ke7314Fty4tPtTWZs7shddE3d9Q9jT8bXFV60rJTIMGrKYXwtfDSUN2ANzazr7AmDF16ttUUfyf9hdhzrd5F3WCHQAAAABJRU5ErkJggg=="
                    ></image>
                  </g>
                  <g
                    className="png"
                    transform="matrix(0.800000011920929,0,0,0.800000011920929,60,60)"
                    opacity="1"
                    style={{ display: 'block' }}
                  >
                    <image
                      width="100px"
                      height="100px"
                      preserveAspectRatio="xMidYMid slice"
                      href="data:image/png;base64,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"
                    ></image>
                  </g>
                </g>
              </svg>
            </div>
            <div data-v-647954c7="" className="com__box" style={{ display: 'none' }}>
              <div className="loading" data-v-647954c7="">
                <div className="shape shape-1" data-v-647954c7=""></div>
                <div className="shape shape-2" data-v-647954c7=""></div>
                <div className="shape shape-3" data-v-647954c7=""></div>
                <div className="shape shape-4" data-v-647954c7=""></div>
              </div>
            </div>
          </div>
          <div data-v-647954c7="" className="skeleton-wrapper" style={{ display: 'none' }}>
            <div data-v-647954c7="" className="van-skeleton van-skeleton--animate">
              <div className="van-skeleton__content">
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div data-v-647954c7="" className="van-skeleton van-skeleton--animate">
              <div className="van-skeleton-avatar van-skeleton-avatar--round"></div>
              <div className="van-skeleton__content">
                <h3 className="van-skeleton-title"></h3>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div data-v-647954c7="" className="van-skeleton van-skeleton--animate">
              <div className="van-skeleton__content">
                <h3 className="van-skeleton-title"></h3>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '100%' }}></div>
                <div className="van-skeleton-paragraph" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div
          data-v-1d8fbc24=""
          className="bet-container"
          style={{ '--f13b4d11CurrentFontFamily': "'Roboto', 'Inter', 'sansSerif'" }}
        >
          <div data-v-12a80a3e="" data-v-1d8fbc24="" className="navbar">
            <div data-v-12a80a3e="" className="navbar-fixed">
              <div data-v-12a80a3e="" className="navbar__content">
                <div data-v-12a80a3e="" className="navbar__content-left">
                  <span style={{ fontSize: 'large' }}>
                    <i
                      data-v-12a80a3e=""
                      className="van-badge__wrapper van-icon van-icon-arrow-left" onClick={() => navigate('/index')}
                    ></i
                    >
                  </span>
                </div>
                <div data-v-12a80a3e="" className="navbar__content-center">
                  <div data-v-12a80a3e="" className="navbar__content-title">
                    All Games
                  </div>
                </div>
                <div data-v-12a80a3e="" className="navbar__content-right"></div>
              </div>
            </div>
          </div>
       <div
      style={{
        width: '100%',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        display: 'flex',
        gap: '10px',
        padding: '10px',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}
    >
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => showSection(tab.id)}
          style={{
            minWidth: '100px',
            flexShrink: 0,
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: activeSection === tab.id ? '#f9945c' : '#eee',
            color: activeSection === tab.id ? 'white' : '#333',
            textAlign: 'center',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {tab.label}
        </div>
      ))}
    </div>







          <div data-v-0a9bf0c5="" className="allGames__container-list">
            <div data-v-e4c17073="" data-v-0a9bf0c5="" className="gamesList__container" id="section3" style={{ display: activeSection === 'section3' ? 'grid' : 'none' }}>
              <div data-v-e4c17073="" className="gamesList__container-title">
                Mini Games
              </div>
              <div
                data-v-df3cc798=""
                data-v-e4c17073=""
                className="gameListGrid__container all_container"
              >
          
                <div
                  data-v-860d7030=""
                  data-v-df3cc798=""
                  className="minGame_container all_game"
                >
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("562b299961b0ec40f252a832453c67b0")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/121.png"
                      src="/assets/game-logos/121.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("2126c5c458316ba1f2df65b387b60408")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/chicken-road-main-banner.jpg"
                      src="/assets/game-logos/chicken-road-main-banner.jpg"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("eabf08253165b6bb2646e403de625d1a")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/limbo.png"
                      src="/assets/game-logos/limbo.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("a04d1f3eb8ccec8a4823bdf18e3f0e84")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/aviator2.png"
                      src="/assets/game-logos/aviator2.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("6ab7a4fe5161936012d6b06143918223")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/plinko.png"
                      src="/assets/game-logos/plinko.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash"  onClick={() => handleGameClick("4e7c9f4fbe9b5137f21ebd485a9cfa5c")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Zeus.png"
                      src="/assets/game-logos/JILI/Zeus.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("68724804a3cd30c749e460256b462f00")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Shogun.png"
                      src="/assets/game-logos/JILI/Shogun.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("ddac017cb273a590b7aa0e1ad6a52bef")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Egypt-Glow.png"
                      src="/assets/game-logos/JILI/Egypt-Glow.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("68880d1fcbd274f6b2bf7168276af51d")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Pig-House.png"
                      src="/assets/game-logos/JILI/Pig-House.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("4702eb871271aa62ef3f3d78f5d968c1")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Pirate-Queen2.png"
                      src="/assets/game-logos/JILI/Pirate-Queen2.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("4bf1d6a75d91c725f89aa5985544a087")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Lucky-Doggy.png"
                      src="/assets/game-logos/JILI/Lucky-Doggy.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("706342709fa0e5f40068e4e6d81f7358")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/SuperE-Sabong.jpg"
                      src="/assets/game-logos/JILI/SuperE-Sabong.jpg"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash"  onClick={() => handleGameClick("d4fc911a31b3a61edd83bdd95e36f3bf")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/European-Roulette.png"
                      src="/assets/game-logos/JILI/European-Roulette.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("a9b13010273fcb0284c9ef436c5fe2ff")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Poker-King.png"
                      src="/assets/game-logos/JILI/Poker-King.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("ae632f32c3a1e6803f9a6fbec16be28e")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Rummy.png"
                      src="/assets/game-logos/JILI/Rummy.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("f743cb55c2c4b737727ef144413937f4")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/TeenPatti.png"
                      src="/assets/game-logos/JILI/TeenPatti.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash"onClick={() => handleGameClick("07afefc388ab6af8cf26f85286f83fae")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/MINI-FLUSH.png"
                      src="/assets/game-logos/JILI/MINI-FLUSH.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("9e969a7e77e8f61dbe94575e6c96272f")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Speed-Baccarat.png"
                      src="/assets/game-logos/JILI/Speed-Baccarat.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("e333695bcff28acdbecc641ae6ee2b23")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Bombing-Fishing.png"
                      src="/assets/game-logos/JILI/Bombing-Fishing.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("71c68a4ddb63bdc8488114a08e603f1c")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Happy-Fishing.png"
                      src="/assets/game-logos/JILI/Happy-Fishing.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("caacafe3f64a6279e10a378ede09ff38")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Mega-Fishing.png"
                      src="/assets/game-logos/JILI/Mega-Fishing.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("3cf4a85cb6dcf4d8836c982c359cd72d")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Jackpot-Fishing.png"
                      src="/assets/game-logos/JILI/Jackpot-Fishing.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("e794bf5717aca371152df192341fe68b")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/1.png"
                      src="/assets/game-logos/JILI/1.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("9ec2a18752f83e45ccedde8dfeb0f6a7")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/119.png"
                      src="/assets/game-logos/JILI/119.png"
                    />
                  </div>
                  {/* <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/109.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/109.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/108.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/108.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/107.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/107.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/106.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/106.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/105.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/105.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/104.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/104.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/102.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/102.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/101.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/101.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/120.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/TB_Chess/120.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/SPRIBE/22002.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/SPRIBE/22002.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/SPRIBE/22003.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/SPRIBE/22003.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/JILI/224.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/JILI/224.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/JILI/232.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/JILI/232.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/JILI/233.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/JILI/233.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/JILI/236.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/JILI/236.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/SPRIBE/22005.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/SPRIBE/22005.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/SPRIBE/22006.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/SPRIBE/22006.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash">
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="https://ossimg.envyenvelope.com/daman/gamelogo/SPRIBE/22007.png"
                      src="https://ossimg.envyenvelope.com/daman/gamelogo/SPRIBE/22007.png"
                    />
                  </div> */}
                </div>

                {/*v-if*/}
              </div>


            </div>
           <div data-v-e4c17073="" data-v-0a9bf0c5="" class="gamesList__container"id="section4" style={{ display: activeSection === 'section4' ? 'block' : 'none' }}>
              <div data-v-e4c17073="" class="gamesList__container-title">Lottery</div>
              <div data-v-df3cc798="" data-v-e4c17073="" class="gameListGrid__container all_container">
                <div data-v-acaadf81="" data-v-df3cc798="" class="lottery_container">

                  <div data-v-acaadf81="" class="lotterySlotItem" onClick={() => handleNavigation('/wingo')}>
                    <img data-v-acaadf81="" class="" data-origin="/assets/lotterycategory_20240123160120h4kw.png" src="/assets/lotterycategory_20240123160120h4kw.png"/><span data-v-acaadf81="">Win Go</span>
                      <h4 data-v-acaadf81="">
                        <div data-v-acaadf81="">Guess Number</div>
                        <div data-v-acaadf81="">Green/Red/Violet to win</div>
                      </h4>
                  </div>
                  <div data-v-acaadf81="" class="lotterySlotItem" onClick={() => handleNavigation('/AllLotteryGames/K3')}>
                    <img data-v-acaadf81="" class="ar-lazyload" data-origin="/assets/lotterycategory_20240123160129bev8.png" src="/assets/lotterycategory_20240123160129bev8.png"/><span data-v-acaadf81="">K3</span>
                      <h4 data-v-acaadf81="">
                        <div data-v-acaadf81="">Guess Number</div>
                        <div data-v-acaadf81="">Big/Small/Odd/Even</div>
                      </h4>
                  </div>
                  <div data-v-acaadf81="" class="lotterySlotItem" onClick={() => handleNavigation('/home/AllLotteryGames/5D')}>
                    <img data-v-acaadf81="" class="ar-lazyload" data-origin="/assets/lotterycategory_20240123160137lok5.png" src="/assets/lotterycategory_20240123160137lok5.png"/><span data-v-acaadf81="">5D</span>
                      <h4 data-v-acaadf81="">
                        <div data-v-acaadf81="">Guess Number</div>
                        <div data-v-acaadf81="">Big/Small/Odd/Even</div>
                      </h4>
                  </div>
                  {/* <div data-v-acaadf81="" class="lotterySlotItem">
                    <img data-v-acaadf81="" class="ar-lazyload" data-origin="https://ossimg.envyenvelope.com/daman/lotterycategory/lotterycategory_202401231601472sqb.png"/><span data-v-acaadf81="">Trx Win</span>
                      <h4 data-v-acaadf81="">
                        <div data-v-acaadf81="">Guess Number</div>
                        <div data-v-acaadf81="">Green/Red/Violet to win</div>
                      </h4>
                  </div> */}
                </div>
              </div>
            </div>

            <div data-v-e4c17073="" data-v-0a9bf0c5="" class="gamesList__container" id="section5" style={{ display: activeSection === 'section5' ? 'grid' : 'none' }}>
              <div data-v-e4c17073="" class="gamesList__container-title">Casino</div>
              <div data-v-df3cc798="" data-v-e4c17073="" class="gameListGrid__container all_container">
                <div data-v-df3cc798="" class="otherGame">
                 
                   <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("191d02a6e852cd18ce1dd4d175e96cd6")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/Keno-Extra-Bet.png" src="/assets/game-logos/JILI/Keno-Extra-Bet.png" />
                  </div>
                 <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("8f0ea9429cab15f2a48d9f4972d30b52")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/Keno-Super-Chance.png" src="/assets/game-logos/JILI/Keno-Super-Chance.png" />
                  </div>
                  <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("db89731adb091f081381d77eb5a06162")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/Thai-Hilo.png" src="/assets/game-logos/JILI/Thai-Hilo.png" />
                  </div>
                   <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("858afeefec569d30eb8a041b335e7507")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/Fortune-Roulette.png" src="/assets/game-logos/JILI/Fortune-Roulette.png" />
                  </div>
                  <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("e3b71c6844eb8c30f5ef210ad92725a6")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/Plinko.png" src="/assets/game-logos/JILI/Plinko.png" />
                  </div>
                   <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("a7f3e5f210523a989a7c6b32f2f1ad42")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/Crash-Bonus.png" src="/assets/game-logos/JILI/Crash-Bonus.png" />
                  </div>
                   <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("edef29b5eda8e2eaf721d7315491c51d")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/Go-Rush.png" src="/assets/game-logos/JILI/Go-Rush.png" />
                  </div>
                   <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("a54e3f5e231085c7d8ba99e8ed2261fc")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/Keno.png" src="/assets/game-logos/JILI/Keno.png" />
                  </div>
                   <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("72ce7e04ce95ee94eef172c0dfd6dc17")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/Mines.png" src="/assets/game-logos/JILI/Mines.png" />
                  </div>
                   <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("4bceeb28b1a88c87d1ef518d7af2bba9")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/Mines-Gold.png" src="/assets/game-logos/JILI/Mines-Gold.png" />
                  </div>
                   <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("8e939551b9e785001fcb5b0a32f88aba")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/Tower.png" src="/assets/game-logos/JILI/Tower.png" />
                  </div>
                  <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("bd8a2bb2dd63503b93cf6ac9492786ce")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/HILO.png" src="/assets/game-logos/JILI/HILO.png" />
                  </div>
                   <div data-v-1153e4fd="" data-v-df3cc798="" class="lotterySlotItem__container" onClick={() => handleGameClick("6e19e03c50f035ddd9ffd804c30f8c80")}>
                    {/* <div data-v-1153e4fd="" class="title">
                      <div data-v-1153e4fd="" class="tit">Casino</div>
                    </div> */}
                    <img data-v-1153e4fd="" class="game_img" data-origin="/assets/game-logos/JILI/Wheel.png" src="/assets/game-logos/JILI/Wheel.png" />
                  </div>
                </div>
              </div>
            </div>  
            <div data-v-e4c17073="" data-v-0a9bf0c5="" className="gamesList__container" id="section6" style={{ display: activeSection === 'section6' ? 'grid' : 'none' }}>
              <div data-v-e4c17073="" className="gamesList__container-title">
                Fishing
              </div>

              <div
                data-v-df3cc798=""
                data-v-e4c17073=""
                className="gameListGrid__container all_container"
              >
          
                <div
                  data-v-860d7030=""
                  data-v-df3cc798=""
                  className="minGame_container all_game"
                >
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("e333695bcff28acdbecc641ae6ee2b23")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Bombing-Fishing.png"
                      src="/assets/game-logos/JILI/Bombing-Fishing.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("71c68a4ddb63bdc8488114a08e603f1c")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Happy-Fishing.png"
                      src="/assets/game-logos/JILI/Happy-Fishing.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("caacafe3f64a6279e10a378ede09ff38")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Mega-Fishing.png"
                      src="/assets/game-logos/JILI/Mega-Fishing.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("3cf4a85cb6dcf4d8836c982c359cd72d")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Jackpot-Fishing.png"
                      src="/assets/game-logos/JILI/Jackpot-Fishing.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("e794bf5717aca371152df192341fe68b")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/1.png"
                      src="/assets/game-logos/JILI/1.png"
                    />
                  </div>
                    <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("9ec2a18752f83e45ccedde8dfeb0f6a7")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/119.png"
                      src="/assets/game-logos/JILI/119.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("eef3e28f0e3e7b72cbca61e7924d00f1")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Dinosaur-Tycoon.png"
                      src="/assets/game-logos/JILI/Dinosaur-Tycoon.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("1200b82493e4788d038849bca884d773")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Dragon-Fortune.png"
                      src="/assets/game-logos/JILI/Dragon-Fortune.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("f02ede19c5953fce22c6098d860dadf4")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Boom-Legend.png"
                      src="/assets/game-logos/JILI/Boom-Legend.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("bbae6016f79f3df74e453eda164c08a4")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Dinosaur-Tycoon-II.png"
                      src="/assets/game-logos/JILI/Dinosaur-Tycoon-II.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("564c48d53fcddd2bcf0bf3602d86c958")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Ocean-King-Jackpot.png"
                      src="/assets/game-logos/JILI/Ocean-King-Jackpot.png"
                    />
                  </div>

                </div>
                {/*v-if*/}
              </div>
            </div>


            <div data-v-e4c17073="" data-v-0a9bf0c5="" className="gamesList__container" id="section7" style={{ display: activeSection === 'section7' ? 'grid' : 'none' }}>
              <div data-v-e4c17073="" className="gamesList__container-title">
                Rummy
              </div>

              <div
                data-v-df3cc798=""
                data-v-e4c17073=""
                className="gameListGrid__container all_container"
              >
          
                <div
                  data-v-860d7030=""
                  data-v-df3cc798=""
                  className="minGame_container all_game"
                >
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("d4fc911a31b3a61edd83bdd95e36f3bf")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/European-Roulette.png"
                      src="/assets/game-logos/JILI/European-Roulette.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("a9b13010273fcb0284c9ef436c5fe2ff")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Poker-King.png"
                      src="/assets/game-logos/JILI/Poker-King.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("ae632f32c3a1e6803f9a6fbec16be28e")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Rummy.png"
                      src="/assets/game-logos/JILI/Rummy.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("f743cb55c2c4b737727ef144413937f4")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/TeenPatti.png"
                      src="/assets/game-logos/JILI/TeenPatti.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("07afefc388ab6af8cf26f85286f83fae")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/MINI-FLUSH.png"
                      src="/assets/game-logos/JILI/MINI-FLUSH.png"
                    />
                  </div>
                    <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("9e969a7e77e8f61dbe94575e6c96272f")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Speed-Baccarat.png"
                      src="/assets/game-logos/JILI/Speed-Baccarat.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("36d20c24669dca7630715f2e0a7c18be")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Number-King.png"
                      src="/assets/game-logos/JILI/Number-King.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("0d0a5a1731a6a05ffeb0e0f9d1948f80")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Journey-West-M.png"
                      src="/assets/game-logos/JILI/Journey-West-M.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("e7ac92d2fdd2aedca92a3521b4416f47")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Dragon-Tiger.png"
                      src="/assets/game-logos/JILI/Dragon-Tiger.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("3aca3084a5c1a8c77c52d6147ee3d2ab")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/7up7down.png"
                      src="/assets/game-logos/JILI/7up7down.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("b9c7c5f589cdaa63c4495e69eaa6dbbf")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Baccarat.png"
                      src="/assets/game-logos/JILI/Baccarat.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("de0dc8a7fd369bd39a2d5747be87825c")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Sic-Bo.png"
                      src="/assets/game-logos/JILI/Sic-Bo.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("c9f2470e285f3580cd761ba2e1f067e1")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Lucky-Bingo.png"
                      src="/assets/game-logos/JILI/Lucky-Bingo.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("780d43c0a98bc8f6a0705976605608c3")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Jackpot-Bingo.png"
                      src="/assets/game-logos/JILI/Jackpot-Bingo.png"
                    />
                  </div>
                    <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("4e5ddaa644badc5f68974a65bf7af02a")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Go-Goal-BIngo.png"
                      src="/assets/game-logos/JILI/Go-Goal-BIngo.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("b2f05dae5370035a2675025953d1d115")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Calaca-Bingo.png"
                      src="/assets/game-logos/JILI/Calaca-Bingo.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("8d2c1506dc4ae4c47d23f9359d71c360")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/West-Hunter-Bingo.png"
                      src="/assets/game-logos/JILI/West-Hunter-Bingo.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("2303867628a9a62272da7576665bbc65")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Bingo-Adventure.png"
                      src="/assets/game-logos/JILI/Bingo-Adventure.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("848ac1703885d5a86b54fbbf094b3b63")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Magic-Lamp-Bingo.png"
                      src="/assets/game-logos/JILI/Magic-Lamp-Bingo.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("0995142f4685f66dfdd1a54fffa66ffa")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Pearlsof-Bingo.png"
                      src="/assets/game-logos/JILI/Pearlsof-Bingo.png"
                    />
                  </div>


                </div>
                {/*v-if*/}
              </div>
            </div>

             <div data-v-e4c17073="" data-v-0a9bf0c5="" className="gamesList__container" id="section8" style={{ display: activeSection === 'section8' ? 'grid' : 'none' }}>
              <div data-v-e4c17073="" className="gamesList__container-title">
                Slot
              </div>

              <div
                data-v-df3cc798=""
                data-v-e4c17073=""
                className="gameListGrid__container all_container"
              >
          
                <div
                  data-v-860d7030=""
                  data-v-df3cc798=""
                  className="minGame_container all_game"
                >
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("71468f38b1fa17379231d50635990c31")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Arena-Fighter.png"
                      src="/assets/game-logos/JILI/Arena-Fighter.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("fba154365cdf8fad07565cf93bae3521")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Potion-Wizard.png"
                      src="/assets/game-logos/JILI/Potion-Wizard.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("bfde2986a4eb3a5a559ac8a8c64df461")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Party-Star.png"
                      src="/assets/game-logos/JILI/Party-Star.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("6bb74b0a57a66850b79ab5c93864cac3")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Treasure-Quest.png"
                      src="/assets/game-logos/JILI/Treasure-Quest.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("ca72a7ad1ca4fa2cdc9a1c49c8bb3332")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Coin-Tree.png"
                      src="/assets/game-logos/JILI/Coin-Tree.png"
                    />
                  </div>
                    <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("25bff08b69ccd31c238a627b53afff36")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/3-Coin-Wild-Horse.png"
                      src="/assets/game-logos/JILI/3-Coin-Wild-Horse.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("7af6be9d29bb593fa0f6516b14b02103")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/3-LUCKY-LION.png"
                      src="/assets/game-logos/JILI/3-LUCKY-LION.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("b4fe8cea772a7643551a12de806472e8")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Roma-X-Deluxe.png"
                      src="/assets/game-logos/JILI/Roma-X-Deluxe.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("d6d14943efe13dd3bcf1428d0f702024")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Fortune-Coins.png"
                      src="/assets/game-logos/JILI/Fortune-Coins.png"
                    />
                  </div>
                   {/* <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("3aca3084a5c1a8c77c52d6147ee3d2ab")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/7up7down.png"
                      src="/assets/game-logos/JILI/7up7down.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("b9c7c5f589cdaa63c4495e69eaa6dbbf")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Baccarat.png"
                      src="/assets/game-logos/JILI/Baccarat.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("de0dc8a7fd369bd39a2d5747be87825c")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Sic-Bo.png"
                      src="/assets/game-logos/JILI/Sic-Bo.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("c9f2470e285f3580cd761ba2e1f067e1")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Lucky-Bingo.png"
                      src="/assets/game-logos/JILI/Lucky-Bingo.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("780d43c0a98bc8f6a0705976605608c3")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Jackpot-Bingo.png"
                      src="/assets/game-logos/JILI/Jackpot-Bingo.png"
                    />
                  </div>
                    <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("4e5ddaa644badc5f68974a65bf7af02a")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Go-Goal-BIngo.png"
                      src="/assets/game-logos/JILI/Go-Goal-BIngo.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("b2f05dae5370035a2675025953d1d115")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Calaca-Bingo.png"
                      src="/assets/game-logos/JILI/Calaca-Bingo.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("8d2c1506dc4ae4c47d23f9359d71c360")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/West-Hunter-Bingo.png"
                      src="/assets/game-logos/JILI/West-Hunter-Bingo.png"
                    />
                  </div>
                  <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("2303867628a9a62272da7576665bbc65")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Bingo-Adventure.png"
                      src="/assets/game-logos/JILI/Bingo-Adventure.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("848ac1703885d5a86b54fbbf094b3b63")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Magic-Lamp-Bingo.png"
                      src="/assets/game-logos/JILI/Magic-Lamp-Bingo.png"
                    />
                  </div>
                   <div data-v-860d7030="" className="onlineGamesItem flash" onClick={() => handleGameClick("0995142f4685f66dfdd1a54fffa66ffa")}>
                    <img
                      data-v-860d7030=""
                      className="min_game_img"
                      data-origin="/assets/game-logos/JILI/Pearlsof-Bingo.png"
                      src="/assets/game-logos/JILI/Pearlsof-Bingo.png"
                    />
                  </div> */}


                </div>
                {/*v-if*/}
              </div>
            </div>
               
          </div>
        </div>





      </div>
    </div>

  )
}