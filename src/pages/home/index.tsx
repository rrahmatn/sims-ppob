import React, { useEffect, useState } from "react";
import { Banner, Hero, Layout, TransactionButton } from "../../components";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Banners, Services } from "../../types";
import { useDispatch } from "react-redux";
import { setPayment } from "../../redux/reducer/payment";
import { Reorder, useDragControls } from "framer-motion";

const Home: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [services, setServices] = useState<Services[]>([]);
  const [banners, setBanners] = useState<Banners[]>([]);
  const [cookies ] = useCookies(["access_token"]);

  const controls = useDragControls();
  const dispatch = useDispatch();

  const getServices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/services`, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
      const payload = response.data.data;
      setServices(payload);
    } catch (error) {
      console.log({ error });
    }
  };
  const getBanner = async () => {
    try {
      const response = await axios.get(`${apiUrl}/banner`, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
      const payload = response.data.data;
      setBanners(payload);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getServices();
    getBanner();
  }, []);

  return (
    <>
      <Layout>
        <div className="w-full flex flex-col gap-2 md:gap-3 lg:gap-8">
          <Hero />
          <Reorder.Group
            as="span"
            axis="x"
            values={services}
            onReorder={setServices}
            className="w-full flex flex-row mx-auto place-content-center md:place-content-start md:px-5 flex-wrap  py-4 gap-x-6 gap-y-6 shadow-sm bg-slate-50 "
          >
            {services?.map((item, index) => (
              <Reorder.Item
                key={index}
                value={item}
                initial={{ x: 200 * index , opacity : 0 }}
                transition={{
                  duration: 0.4 * (index * 0.2),
                  delay: 0.2 * (index * 0.2),
                  ease: "easeInOut",
                }}
                animate={{ x: 0 , opacity : 1 }}
                exit={{ x: 100 * index }}
                as="div"
              >
                <TransactionButton
                  onClick={() =>
                    dispatch(
                      setPayment({
                        ...item,
                      })
                    )
                  }
                  key={index}
                  text={item.service_name}
                  img={item.service_icon}
                  to={`/payment?code=${item.service_code}`}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <section className=" px-3 md:px-7 py-5 shadow-lg rounded-md ">
            <h4 className=" text-lg tracking-wider font-medium">
              Temukan promo menarik
            </h4>

            <Reorder.Group
              axis="x"
              values={banners}
              onReorder={setBanners}
              className="carousel carousel-start flex flex-row overflow-x-auto  my-2  space-x-4"
            >
              {banners?.map((item, index) => (
                <Reorder.Item
                  dragListener={false}
                  dragControls={controls}
                  key={index}
                  value={item}
                  initial={{ x: 200 * index }}
                  transition={{
                    duration: 0.4 * (index * 0.4),
                    delay: 0.3 * (index * 0.4),
                    ease: "easeInOut",
                  }}
                  animate={{ x: 0 }}
                  exit={{ x: 100 * index }}
                >
                  <Banner
                    to="/"
                    title={item.banner_name}
                    desc={item.description}
                    img={item.banner_image}
                    sx={"carousel-item"}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default Home;
