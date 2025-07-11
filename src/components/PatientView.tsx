import React, {useState, useRef, useEffect} from 'react'
import Medications from './Medications'
import { Camera } from 'lucide-react';
import Calender from "./Calender"
import dayjs from "dayjs"

import { supabase } from "../supabase";
import MedicationSummaryCard from './SummaryCard';

const PatientView = () => {
    
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasMarkedToday, setHasMarkedToday] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [medicationId, setMedicationId] = useState<string | null>(null); 
    const [medicationLogs, setMedicationLogs] = useState<{ date_taken: string }[]>([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const todayDateStr = dayjs().format('YYYY-MM-DD');

    useEffect(() => {
        const fetchStatus = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
    
          const { data } = await supabase
            .from('medicationLog')
            .select('*')
            .eq('user_id', user.id)
            .eq('date_taken', todayDateStr)
            .single();
    
          if (data) setHasMarkedToday(true);
        };
    
        fetchStatus();
    }, []);
  
  
    const fetchMedicationLogs = async () => {
      const { data } = await supabase
        .from('medicationLog')
        .select('*');
      if (data) setMedicationLogs(data);
    };
  
    useEffect(() => {
      fetchMedicationLogs();
  
      const channel = supabase
        .channel('realtime-medicationLog')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'medicationLog' }, (payload) => {
            
            fetchMedicationLogs();
          
        })
        .subscribe();
  
      return () => {
        supabase.removeChannel(channel);
      };
    }, []);
  
  
  
    
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setSelectedImage(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
    
    };
    const handleMarkAsTaken = async () => {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !selectedImage || !medicationId) {
            alert('Please select medication and image.');
            console.log(user)
            console.log(medicationId)
          setIsLoading(false);
          return;
        }
    
        const filePath = `private/${medicationId}-${todayDateStr}.jpg`;
    
        const { error: uploadError } = await supabase.storage
          .from('medication-image')
          .upload(filePath, selectedImage, { upsert: true });
    
        if (uploadError) {
          alert('Failed to upload image');
          setIsLoading(false);
          return;
        }
    
        const publicUrl = supabase
          .storage
          .from('medication-image')
          .getPublicUrl(filePath).data.publicUrl;
    
        const { error } = await supabase
          .from('medicationLog')
          .insert([{
            user_id: user.id,
            date_taken: todayDateStr,
            medication_id: medicationId,  
            image_url: publicUrl
          }]);
    
        if (!error) {
          setHasMarkedToday(true);
          alert('Medication marked as taken!');
          setShowSuccessMessage(true)
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          alert('Failed to save medication');
        }
    
        setIsLoading(false);
      };
      


  return (
    <div className='flex h-screen flex-col bg-gradient-to-b from-blue-50 to-green-50'>
      <div className='mt-5 m-10 mr-10'>
       <MedicationSummaryCard />
     </div>
    <div className='flex flex-col items-center justify-between md:flex-row bg-gradient-to-b from-blue-50 to-green-50 mt-20 ml-10 mr-10 gap-6'>
    <div className="flex flex-col border border-gray-200  p-4 bg-white hover:shadow-lg transition-shadow duration-300 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
    <h3 className="text-lg font-semibold  mb-2">Todays Medication</h3>
        {hasMarkedToday ? (
          
          <div className="border border-green-300 bg-green-50 rounded-lg p-6 text-center shadow ">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-green-700 mb-2">Medication Completed!</h3>
            <p className="text-sm text-green-600">
              Great job! You've taken your medication for {dayjs().format('MMMM D, YYYY')}.
            </p>
          </div>
        ) : (
          
          <>
            <h4 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 text-center">Add Medication</h4>
            <Medications onMedicationSelect={setMedicationId} />
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white">
              <div className="mb-4 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h4l1-2h8l1 2h4v12H3V7zm9 3a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Add Proof Photo </h3>
              <p className="text-sm text-gray-500 mb-4">Take a photo of your medication or pill organizer as confirmation</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                ref={fileInputRef}
                className="hidden"
                />
              <button
                className="flex items-center gap-2 bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                onClick={() => fileInputRef.current?.click()}
                >
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">
                  Upload Photo
                </span>
              </button>
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Medication proof"
                    className="max-w-full h-32 object-cover rounded-lg mx-auto border-2 border-border"
                    />
                  <p className="text-sm text-muted-foreground mt-2">
                    Photo selected: {selectedImage?.name}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleMarkAsTaken}
              disabled={hasMarkedToday || !selectedImage || isLoading}
              className={`w-full py-2 text-lg mt-5 text-white rounded ${hasMarkedToday ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
              {hasMarkedToday ? 'Already Taken' : isLoading ? 'Saving...' : 'Mark as Taken'}
            </button>
          </>)}
          </div>
          <div className='flex flex-col  bg-none w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto mt-10'>
          <Calender onMarkAsTaken={handleMarkAsTaken} hasMarkedToday={hasMarkedToday} medicationLogs={medicationLogs}/>
          </div>
    </div>
              </div>
  )
}


export default PatientView