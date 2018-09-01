const analytics = {

    calculateBMI(member) {
        if (member.assessments.length > 0) {
            const lastIndex = member.assessments.length - 1;
            const lastAssessment = member.assessments[lastIndex];
            return parseFloat(lastAssessment.weight / (member.height * member.height)).toFixed(2);
        } else {
            return parseFloat(member.startingweight / (member.height * member.height)).toFixed(2);
        }
    },

    determineBMICategory(bmiValue) {
        let category = "";
        if (bmiValue < 16) {
            category = "SEVERELY UNDERWEIGHT";
        } else if (bmiValue >= 16 && bmiValue < 18.5) {
            category = "UNDERWEIGHT";
        } else if (bmiValue >= 18.5 && bmiValue < 25) {
            category = "NORMAL";
        } else if (bmiValue >= 25 && bmiValue < 30) {
            category = "OVERWEIGHT";
        } else if (bmiValue >= 30 && bmiValue < 35) {
            category = "MODERATELY OBESE";
        } else if (bmiValue >= 35) {
            category = "SEVERELY OBESE";
        }
        return category;
    },

    isIdealBodyWeight(member) {
        const maleIdealWeight = 50;
        const femaleIdealWeight = 45.5;
        // converting meters to inches
        const heightInInches = member.height * 39.3701;
        let inchesOver5feet = 0;
        if (heightInInches > 60) {
            inchesOver5feet = heightInInches - 60;
        }
        let idealWeight = 0;
        if (member.gender.toUpperCase() === "male".toUpperCase()) {
            idealWeight = maleIdealWeight + (2.3 * inchesOver5feet);
        } else {
            idealWeight = femaleIdealWeight + (2.3 * inchesOver5feet);
        }
        let isIdealWeight = false;
        if (member.assessments.length > 0) {
            const lastIndex = member.assessments.length - 1;
            // if weight between these 2 numbers
            if (member.assessments[lastIndex].weight >= (idealWeight - 0.2) &&
                member.assessments[lastIndex].weight <= (idealWeight + 0.2)) {
                isIdealWeight = true;
            } else {
                isIdealWeight = false;
            }
        } else {
            if (member.startingweight >= (idealWeight - 0.2) && member.startingweight <= (idealWeight + 0.2)) {
                isIdealWeight = true;
            } else {
                isIdealWeight = false;
            }
        }
        return isIdealWeight;
    },

}

module.exports = analytics;
